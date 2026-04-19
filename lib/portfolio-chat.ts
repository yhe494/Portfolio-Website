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
const TOP_K = 6
const MAX_CONTEXT_MESSAGES = Number(process.env.CHAT_MAX_CONTEXT_MESSAGES || 4)
const MAX_OUTPUT_TOKENS = Number(process.env.CHAT_MAX_OUTPUT_TOKENS || 180)

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

  return ""
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

  const topChunks = chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, TOP_K)

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
        "You are the portfolio assistant for Yanhua He. Answer only using the provided knowledge snippets. If the answer is not supported by the snippets, say that you do not see that information in Yanhua's background yet. Keep answers concise, professional, and recruiter-friendly. Answer in first person when describing Yanhua's background, but do not invent metrics, employers, courses, or technologies.",
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
      text: {
        format: {
          type: "text",
        },
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
