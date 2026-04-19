import { NextResponse } from "next/server"

import {
  answerPortfolioQuestion,
  getEmbeddedKnowledge,
  type ChatMessage,
} from "@/lib/portfolio-chat"
import { client } from "@/sanity/lib/client"
import {
  coursesQuery,
  experiencesQuery,
  projectsQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries"

type RateLimitEntry = {
  count: number
  resetAt: number
  blockedUntil?: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const DEFAULTS = {
  maxMessages: Number(process.env.CHAT_MAX_MESSAGES || 6),
  maxQuestionChars: Number(process.env.CHAT_MAX_QUESTION_CHARS || 400),
  maxMessageChars: Number(process.env.CHAT_MAX_MESSAGE_CHARS || 600),
  maxTotalChars: Number(process.env.CHAT_MAX_TOTAL_CHARS || 2200),
  maxRequestsPerWindow: Number(process.env.CHAT_RATE_LIMIT_MAX_REQUESTS || 5),
  rateLimitWindowMs: Number(process.env.CHAT_RATE_LIMIT_WINDOW_MS || 60_000),
  cooldownMs: Number(process.env.CHAT_RATE_LIMIT_COOLDOWN_MS || 15 * 60_000),
}

const portfolioKeywords = [
  "yanhua",
  "you",
  "your",
  "yourself",
  "background",
  "resume",
  "experience",
  "work",
  "job",
  "career",
  "project",
  "portfolio",
  "education",
  "school",
  "course",
  "skill",
  "stack",
  "tech",
  "cloud",
  "aws",
  "docker",
  "kubernetes",
  "react",
  "next",
  "python",
  "java",
  "fastapi",
  "mongodb",
  "postgresql",
  "support",
  "debug",
  "frontend",
  "backend",
  "strength",
  "hire",
  "fit",
]

const suspiciousPatterns = [
  /ignore\s+(all\s+)?previous/i,
  /system\s+prompt/i,
  /developer\s+message/i,
  /jailbreak/i,
  /repeat\s+.*forever/i,
  /generate\s+\d{3,}/i,
  /write\s+(a|an)\s+(essay|story|poem|novel|blog post)/i,
  /translate\s+/i,
  /summari[sz]e\s+(this|the following)/i,
  /browse\s+the\s+web/i,
  /scrape\s+/i,
  /base64/i,
  /token\s+count/i,
]

function cleanupRateLimitStore(now: number) {
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now && (!value.blockedUntil || value.blockedUntil <= now)) {
      rateLimitStore.delete(key)
    }
  }
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown"
  }

  return request.headers.get("x-real-ip") || "unknown"
}

function checkRateLimit(request: Request) {
  const now = Date.now()
  cleanupRateLimitStore(now)

  const ip = getClientIp(request)
  const existing = rateLimitStore.get(ip)

  if (existing?.blockedUntil && existing.blockedUntil > now) {
    return {
      limited: true,
      retryAfterSeconds: Math.ceil((existing.blockedUntil - now) / 1000),
    }
  }

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + DEFAULTS.rateLimitWindowMs,
    })

    return { limited: false }
  }

  existing.count += 1

  if (existing.count > DEFAULTS.maxRequestsPerWindow) {
    existing.blockedUntil = now + DEFAULTS.cooldownMs
    rateLimitStore.set(ip, existing)

    return {
      limited: true,
      retryAfterSeconds: Math.ceil(DEFAULTS.cooldownMs / 1000),
    }
  }

  rateLimitStore.set(ip, existing)
  return { limited: false }
}

function normalizeMessageContent(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function isOffTopic(question: string) {
  const normalized = question.toLowerCase()
  return !portfolioKeywords.some((keyword) => normalized.includes(keyword))
}

function isSuspicious(question: string) {
  return suspiciousPatterns.some((pattern) => pattern.test(question))
}

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(request)
    if (rateLimit.limited) {
      return NextResponse.json(
        {
          error:
            "Too many chat requests from this connection. Please wait a bit before trying again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      )
    }

    const body = (await request.json()) as {
      messages?: ChatMessage[]
    }

    const messages = Array.isArray(body.messages)
      ? body.messages
          .filter(
            (message): message is ChatMessage =>
              Boolean(message) &&
              (message.role === "user" || message.role === "assistant") &&
              typeof message.content === "string",
          )
          .map((message) => ({
            ...message,
            content: normalizeMessageContent(message.content).slice(
              0,
              DEFAULTS.maxMessageChars,
            ),
          }))
          .filter((message) => message.content.length > 0)
          .slice(-DEFAULTS.maxMessages)
      : []

    const latestQuestion = [...messages]
      .reverse()
      .find((message) => message.role === "user")

    if (!latestQuestion?.content.trim()) {
      return NextResponse.json(
        { error: "Please send a question to the portfolio assistant." },
        { status: 400 },
      )
    }

    if (latestQuestion.content.length > DEFAULTS.maxQuestionChars) {
      return NextResponse.json(
        {
          error: `Please keep your question under ${DEFAULTS.maxQuestionChars} characters.`,
        },
        { status: 400 },
      )
    }

    const totalChars = messages.reduce(
      (sum, message) => sum + message.content.length,
      0,
    )

    if (totalChars > DEFAULTS.maxTotalChars) {
      return NextResponse.json(
        {
          error:
            "This conversation is too long for the public portfolio assistant. Please start a new question.",
        },
        { status: 400 },
      )
    }

    if (isSuspicious(latestQuestion.content)) {
      return NextResponse.json(
        {
          error:
            "This assistant only answers normal questions about Yanhua's background and portfolio.",
        },
        { status: 400 },
      )
    }

    if (isOffTopic(latestQuestion.content)) {
      return NextResponse.json(
        {
          error:
            "This assistant is limited to questions about Yanhua's experience, projects, skills, education, and portfolio.",
        },
        { status: 400 },
      )
    }

    const [settings, experiences, projects, courses] = await Promise.all([
      client.fetch(siteSettingsQuery),
      client.fetch(experiencesQuery),
      client.fetch(projectsQuery),
      client.fetch(coursesQuery),
    ])

    const chunks = await getEmbeddedKnowledge({
      settings,
      experiences,
      projects,
      courses,
    })

    const result = await answerPortfolioQuestion({
      question: latestQuestion.content,
      messages,
      chunks,
    })

    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
