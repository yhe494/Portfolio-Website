import { createHash } from "node:crypto"

import { resumeProfile } from "@/data/resume-profile"

export type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export type ChatCourse = {
  title?: string
  provider?: string
  completedDate?: string
  topics?: string[]
  notes?: unknown
}

export type SanitySiteSettings = {
  heroTitle?: string
  heroSubtitle?: string
  about?: unknown
  email?: string
  github?: string
  linkedin?: string
}

export type SanityExperience = {
  role?: string
  company?: string
  location?: string
  startDate?: string
  endDate?: string
  highlights?: string[]
  tech?: string[]
}

export type SanityProject = {
  title?: string
  summary?: unknown
  techStack?: string[]
  github?: string
  featured?: boolean
}

export type KnowledgeChunk = {
  id: string
  title: string
  category: string
  source: string
  text: string
}

type EmbeddedKnowledgeChunk = KnowledgeChunk & {
  embedding: number[]
}

type KnowledgeInputs = {
  settings: SanitySiteSettings | null
  experiences: SanityExperience[]
  projects: SanityProject[]
  courses: ChatCourse[]
}

const OPENAI_API_URL = "https://api.openai.com/v1"
const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-5-mini"
const EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small"
const TOP_K = 8
const MAX_CONTEXT_MESSAGES = Number(process.env.CHAT_MAX_CONTEXT_MESSAGES || 4)
const MAX_OUTPUT_TOKENS = Number(process.env.CHAT_MAX_OUTPUT_TOKENS || 220)
const REASONING_EFFORT = process.env.OPENAI_REASONING_EFFORT || "low"

const topicKeywordMap = {
  backend: [
    "backend",
    "server",
    "service",
    "services",
    "api",
    "rest",
    "database",
    "databases",
    "spring",
    "express",
    "fastapi",
    "mongodb",
    "postgresql",
    "sql",
    "jwt",
    "pydantic",
    "java",
    "python",
  ],
  cloud: [
    "cloud",
    "aws",
    "deployment",
    "deploy",
    "infrastructure",
    "kubernetes",
    "docker",
    "elastic beanstalk",
    "rds",
    "s3",
    "dynamodb",
    "vpc",
    "iam",
    "security group",
    "k3s",
  ],
  frontend: [
    "frontend",
    "ui",
    "react",
    "next",
    "html",
    "css",
    "accessibility",
    "wordpress",
    "wcag",
    "layout",
  ],
  support: [
    "debug",
    "debugging",
    "troubleshooting",
    "support",
    "incident",
    "logs",
    "errors",
    "reliability",
    "issue",
    "diagnose",
    "diagnosis",
  ],
}

const embeddingCache = new Map<string, number[]>()
let knowledgeCache:
  | {
      fingerprint: string
      chunks: EmbeddedKnowledgeChunk[]
    }
  | undefined

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function portableTextToPlainText(value: unknown): string {
  if (!value) return ""

  if (typeof value === "string") {
    return normalizeWhitespace(value)
  }

  if (Array.isArray(value)) {
    return normalizeWhitespace(
      value
        .map((block) => {
          if (typeof block === "string") return block
          if (block && typeof block === "object" && "children" in block) {
            const children = (block as { children?: unknown[] }).children
            if (!Array.isArray(children)) return ""

            return children
              .map((child) => {
                if (child && typeof child === "object" && "text" in child) {
                  return String((child as { text?: string }).text || "")
                }

                return ""
              })
              .join("")
          }

          return ""
        })
        .filter(Boolean)
        .join("\n")
    )
  }

  return ""
}

function addChunk(
  list: KnowledgeChunk[],
  seen: Set<string>,
  chunk: Omit<KnowledgeChunk, "id">,
) {
  const text = normalizeWhitespace(chunk.text)
  if (!text) return

  const dedupeKey = `${chunk.category}:${chunk.title}:${text}`.toLowerCase()
  if (seen.has(dedupeKey)) return

  seen.add(dedupeKey)
  list.push({
    ...chunk,
    id: createHash("sha1").update(dedupeKey).digest("hex").slice(0, 12),
    text,
  })
}

export function buildKnowledgeChunks({
  settings,
  experiences,
  projects,
  courses,
}: KnowledgeInputs): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = []
  const seen = new Set<string>()

  addChunk(chunks, seen, {
    category: "summary",
    title: "Professional Summary",
    source: "Resume",
    text: resumeProfile.basics.summary,
  })

  addChunk(chunks, seen, {
    category: "contact",
    title: "Contact and Links",
    source: "Resume",
    text: `Location: ${resumeProfile.basics.location}. Email: ${resumeProfile.basics.email}. LinkedIn: ${resumeProfile.basics.linkedin}. GitHub: ${resumeProfile.basics.github}. Portfolio: ${resumeProfile.basics.portfolio}.`,
  })

  resumeProfile.experience.forEach((item) => {
    addChunk(chunks, seen, {
      category: "experience",
      title: `${item.title} at ${item.organization}`,
      source: "Resume",
      text: `${item.title} at ${item.organization} in ${item.location} from ${item.start} to ${item.end}. Highlights: ${item.highlights.join(" ")}`,
    })
  })

  resumeProfile.projects.forEach((item) => {
    addChunk(chunks, seen, {
      category: "project",
      title: item.title,
      source: "Resume",
      text: `${item.title}. Tech stack: ${item.techStack.join(", ")}. Highlights: ${item.highlights.join(" ")}${item.repository ? ` Repository: ${item.repository}.` : ""}`,
    })
  })

  resumeProfile.skills.forEach((group) => {
    addChunk(chunks, seen, {
      category: "skills",
      title: `${group.category} Skills`,
      source: "Resume",
      text: `${group.category}: ${group.items.join(", ")}`,
    })
  })

  resumeProfile.education.forEach((item) => {
    addChunk(chunks, seen, {
      category: "education",
      title: `${item.credential} - ${item.institution}`,
      source: "Resume",
      text: `${item.credential} at ${item.institution}, ${item.location}, from ${item.start} to ${item.end}.${item.details?.length ? ` Details: ${item.details.join(". ")}.` : ""}`,
    })
  })

  resumeProfile.courses.forEach((item) => {
    addChunk(chunks, seen, {
      category: "course",
      title: item.title,
      source: "Resume",
      text: `${item.title}${item.provider ? ` by ${item.provider}` : ""}. Topics: ${item.topics.join(", ")}.${item.notes ? ` Notes: ${item.notes}.` : ""}`,
    })
  })

  if (settings) {
    addChunk(chunks, seen, {
      category: "profile",
      title: "Site Intro",
      source: "Sanity CMS",
      text: `Hero title: ${settings.heroTitle || ""}. Hero subtitle: ${settings.heroSubtitle || ""}. About: ${portableTextToPlainText(settings.about)}.`,
    })
  }

  experiences.forEach((item) => {
    const title = [item.role, item.company].filter(Boolean).join(" at ")
    addChunk(chunks, seen, {
      category: "experience",
      title: title || "Experience",
      source: "Sanity CMS",
      text: `${item.role || "Role"} at ${item.company || "Company"}${item.location ? ` in ${item.location}` : ""}${item.startDate ? ` from ${item.startDate}` : ""}${item.endDate ? ` to ${item.endDate}` : ""}. Highlights: ${(item.highlights || []).join(" ")}${item.tech?.length ? ` Tech: ${item.tech.join(", ")}.` : ""}`,
    })
  })

  projects.forEach((item) => {
    addChunk(chunks, seen, {
      category: "project",
      title: item.title || "Project",
      source: "Sanity CMS",
      text: `${item.title || "Project"}.${item.featured ? " Featured project." : ""} Summary: ${portableTextToPlainText(item.summary)}${item.techStack?.length ? ` Tech stack: ${item.techStack.join(", ")}.` : ""}${item.github ? ` Repository: ${item.github}.` : ""}`,
    })
  })

  courses.forEach((item) => {
    addChunk(chunks, seen, {
      category: "course",
      title: item.title || "Course",
      source: "Sanity CMS",
      text: `${item.title || "Course"}${item.provider ? ` by ${item.provider}` : ""}${item.completedDate ? ` completed on ${item.completedDate}` : ""}.${item.topics?.length ? ` Topics: ${item.topics.join(", ")}.` : ""}${item.notes ? ` Notes: ${portableTextToPlainText(item.notes)}.` : ""}`,
    })
  })

  return chunks
}

async function createEmbeddings(input: string[]) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY")
  }

  const response = await fetch(`${OPENAI_API_URL}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input,
      encoding_format: "float",
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Embedding request failed: ${response.status} ${errorText}`)
  }

  const data = (await response.json()) as {
    data: Array<{ embedding: number[] }>
  }

  return data.data.map((item) => item.embedding)
}

function cosineSimilarity(left: number[], right: number[]) {
  let dot = 0
  let leftNorm = 0
  let rightNorm = 0

  for (let i = 0; i < left.length; i += 1) {
    dot += left[i] * right[i]
    leftNorm += left[i] * left[i]
    rightNorm += right[i] * right[i]
  }

  if (leftNorm === 0 || rightNorm === 0) return 0

  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm))
}

function inferQueryTopics(question: string) {
  const normalized = question.toLowerCase()

  return Object.entries(topicKeywordMap)
    .filter(([, keywords]) =>
      keywords.some((keyword) => normalized.includes(keyword)),
    )
    .map(([topic]) => topic)
}

function countKeywordMatches(text: string, keywords: string[]) {
  const normalized = text.toLowerCase()
  return keywords.reduce(
    (count, keyword) => count + (normalized.includes(keyword) ? 1 : 0),
    0,
  )
}

function selectRelevantChunks(
  question: string,
  chunks: EmbeddedKnowledgeChunk[],
  queryEmbedding: number[],
) {
  const queryTopics = inferQueryTopics(question)

  const scored = chunks.map((chunk) => {
    let score = cosineSimilarity(queryEmbedding, chunk.embedding)

    for (const topic of queryTopics) {
      const keywords = topicKeywordMap[topic as keyof typeof topicKeywordMap]
      const matches = countKeywordMatches(chunk.text, keywords)

      if (matches > 0) {
        score += Math.min(matches * 0.045, 0.18)
      }
    }

    if (queryTopics.length > 0) {
      if (chunk.category === "skills") score += 0.04
      if (chunk.category === "project") score += 0.05
      if (chunk.category === "experience") score += 0.05
    }

    return { ...chunk, score }
  })

  const selected: Array<(typeof scored)[number]> = []
  const selectedIds = new Set<string>()

  if (queryTopics.length > 0) {
    for (const category of ["experience", "project", "skills"]) {
      const match = scored
        .filter((chunk) => chunk.category === category && chunk.score > 0.18)
        .sort((left, right) => right.score - left.score)[0]

      if (match && !selectedIds.has(match.id)) {
        selected.push(match)
        selectedIds.add(match.id)
      }
    }
  }

  for (const chunk of scored.sort((left, right) => right.score - left.score)) {
    if (selected.length >= TOP_K) break
    if (selectedIds.has(chunk.id)) continue

    selected.push(chunk)
    selectedIds.add(chunk.id)
  }

  return selected
}

async function embedKnowledgeChunks(chunks: KnowledgeChunk[]) {
  const missing = chunks.filter((chunk) => !embeddingCache.has(chunk.id))

  if (missing.length) {
    const embeddings = await createEmbeddings(missing.map((chunk) => chunk.text))
    missing.forEach((chunk, index) => {
      embeddingCache.set(chunk.id, embeddings[index])
    })
  }

  return chunks.map((chunk) => ({
    ...chunk,
    embedding: embeddingCache.get(chunk.id) || [],
  }))
}

export async function getEmbeddedKnowledge(inputs: KnowledgeInputs) {
  const chunks = buildKnowledgeChunks(inputs)
  const fingerprint = createHash("sha1")
    .update(JSON.stringify(chunks.map((chunk) => [chunk.id, chunk.text])))
    .digest("hex")

  if (knowledgeCache?.fingerprint === fingerprint) {
    return knowledgeCache.chunks
  }

  const embedded = await embedKnowledgeChunks(chunks)
  knowledgeCache = {
    fingerprint,
    chunks: embedded,
  }

  return embedded
}

function extractTextsDeep(value: unknown, seen = new WeakSet<object>()): string[] {
  if (!value) return []

  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractTextsDeep(item, seen))
  }

  if (typeof value !== "object") {
    return []
  }

  if (seen.has(value as object)) {
    return []
  }

  seen.add(value as object)

  const record = value as Record<string, unknown>
  const directText =
    typeof record.text === "string" && record.text.trim() ? [record.text.trim()] : []

  return [
    ...directText,
    ...extractTextsDeep(record.value, seen),
    ...extractTextsDeep(record.output_text, seen),
    ...extractTextsDeep(record.content, seen),
    ...extractTextsDeep(record.output, seen),
    ...extractTextsDeep(record.part, seen),
    ...extractTextsDeep(record.text, seen),
    ...Object.entries(record)
      .filter(([key]) => !["output_text", "content", "output", "part", "text", "value"].includes(key))
      .flatMap(([, nestedValue]) => extractTextsDeep(nestedValue, seen)),
  ]
}

function extractResponseText(data: unknown): string {
  if (
    data &&
    typeof data === "object" &&
    "output_text" in data &&
    typeof (data as { output_text?: unknown }).output_text === "string"
  ) {
    return (data as { output_text: string }).output_text.trim()
  }

  if (
    data &&
    typeof data === "object" &&
    "output" in data &&
    Array.isArray((data as { output?: unknown[] }).output)
  ) {
    const messages = (data as { output: Array<{ content?: unknown[] }> }).output

    return messages
      .flatMap((message) => message.content || [])
      .map((content) => {
        if (
          content &&
          typeof content === "object" &&
          "text" in content &&
          typeof (content as { text?: unknown }).text === "string"
        ) {
          return (content as { text: string }).text
        }

        return ""
      })
      .join("\n")
      .trim()
  }

  return extractTextsDeep(data).join("\n").trim()
}

export async function answerPortfolioQuestion({
  question,
  messages,
  chunks,
}: {
  question: string
  messages: ChatMessage[]
  chunks: EmbeddedKnowledgeChunk[]
}) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY")
  }

  const [queryEmbedding] = await createEmbeddings([question])

  const topChunks = selectRelevantChunks(question, chunks, queryEmbedding)

  const context = topChunks
    .map(
      (chunk, index) =>
        `[${index + 1}] ${chunk.title} (${chunk.category}, ${chunk.source})\n${chunk.text}`,
    )
    .join("\n\n")

  const recentMessages = messages
    .slice(-MAX_CONTEXT_MESSAGES)
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n")

  const response = await fetch(`${OPENAI_API_URL}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      instructions:
        "You are the portfolio assistant for Yanhua He. Answer only using the provided knowledge snippets. If the answer is not supported by the snippets, say that you do not see that information in Yanhua's background yet. Keep answers concise, professional, and recruiter-friendly. Answer in first person when describing Yanhua's background, but do not invent metrics, employers, courses, or technologies. When the user asks about an area like backend, cloud, debugging, or strengths, synthesize across relevant work experience, projects, and skills into a short summary instead of listing one item. Use this format: first, 1-2 short sentences summarizing the overall experience; second, one short line that starts with 'This shows up in:' followed by the most relevant jobs or projects. Do not include long supporting-detail bullets. Keep the answer compact and easy to scan.",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Recent conversation:\n${recentMessages || "No prior conversation."}\n\nUser question:\n${question}\n\nGrounding knowledge:\n${context}\n\nWrite a short answer grounded only in the knowledge above.`,
            },
          ],
        },
      ],
      max_output_tokens: MAX_OUTPUT_TOKENS,
      reasoning: {
        effort: REASONING_EFFORT,
      },
      text: {
        format: {
          type: "text",
        },
        verbosity: "low",
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Chat request failed: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  const answer = extractResponseText(data)

  if (!answer) {
    console.error(
      "Chat model returned empty text payload",
      JSON.stringify(data).slice(0, 4000),
    )
    throw new Error("The chat model returned an empty response.")
  }

  return {
    answer,
    sources: topChunks.map((chunk) => ({
      id: chunk.id,
      title: chunk.title,
      category: chunk.category,
      source: chunk.source,
    })),
  }
}
