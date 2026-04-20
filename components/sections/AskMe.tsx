'use client'

import { startTransition, useEffect, useRef, useState } from "react"

type Message = {
  role: "user" | "assistant"
  content: string
}

const suggestedPrompts = [
  "What backend and debugging experience does Yanhua have?",
  "Which projects show Yanhua's cloud or infrastructure experience?",
  "What technical support strengths stand out in Yanhua's background?",
]

export default function AskMe() {
  const [isOpen, setIsOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I’m Yanhua’s portfolio assistant. Ask me about work experience, projects, technical skills, education, or tools Yanhua has used. ",
    },
  ])
  const [question, setQuestion] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = scrollAreaRef.current
    if (!container) return

    container.scrollTop = container.scrollHeight
  }, [messages, isPending, isOpen])

  async function submitQuestion(rawQuestion: string) {
    const trimmed = rawQuestion.trim()
    if (!trimmed || isPending) return

    const nextUserMessage: Message = { role: "user", content: trimmed }

    setIsOpen(true)
    setError("")
    setIsPending(true)
    setQuestion("")
    setMessages((current) => [...current, nextUserMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, nextUserMessage],
        }),
      })

      const data = (await response.json()) as {
        answer?: string
        error?: string
      }

      if (!response.ok || !data.answer) {
        throw new Error(data.error || "Unable to answer right now.")
      }

      startTransition(() => {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: data.answer || "",
          },
        ])
      })
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to answer right now."
      setError(message)
      setMessages((current) => current.slice(0, -1))
      setQuestion(trimmed)
    } finally {
      setIsPending(false)
    }
  }

  const showGuidance = messages.length === 1

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(calc(100vw-1rem),24rem)] flex-col items-end md:bottom-6 md:right-6 md:w-[26rem]">
      {isOpen ? (
        <div className="pointer-events-auto mb-3 flex max-h-[calc(100dvh-6.5rem)] w-full flex-col overflow-hidden rounded-[1.6rem] border border-white/12 bg-dark-bg text-text-light shadow-[0_26px_90px_rgba(15,23,42,0.34)] md:rounded-[1.8rem]">
          <div className="bg-[linear-gradient(135deg,rgba(16,185,129,0.2),rgba(59,130,246,0.18))] px-4 py-4 md:px-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-accent/80">
                  Ask Yanhua
                </div>
                <h3 className="mt-1 font-serif text-xl text-white md:text-2xl">
                  Portfolio Assistant
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-light/72">
                  Ask about experience, projects, tools, education, or what kind
                  of roles fit best.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/14 bg-black/20 px-3 py-1 text-sm text-text-light/70 transition hover:bg-black/30 hover:text-white"
                aria-label="Close chatbot"
              >
                Close
              </button>
            </div>
          </div>

          <div
            ref={scrollAreaRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4 md:px-4"
          >
            {showGuidance ? (
              <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-text-light/50">
                  Try asking
                </div>
                <div className="mt-3 grid gap-2">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void submitQuestion(prompt)}
                      className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-left text-sm leading-6 text-text-light/80 transition hover:border-accent/40 hover:bg-black/28"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-5 text-text-light/48">
                  Answers are grounded in Yanhua’s resume and Sanity-managed
                  portfolio content.
                </p>
              </div>
            ) : null}

            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-3xl p-4 ${
                  message.role === "assistant"
                    ? "mr-4 bg-white/8 text-text-light md:mr-5"
                    : "ml-6 bg-accent/20 text-white md:ml-8"
                }`}
              >
                <div className="text-[11px] uppercase tracking-[0.24em] opacity-55">
                  {message.role === "assistant" ? "Portfolio Assistant" : "You"}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7">
                  {message.content}
                </p>
              </div>
            ))}

            {isPending ? (
              <div className="mr-5 rounded-3xl bg-white/8 p-4 text-sm text-text-light/70">
                Searching resume and portfolio content...
              </div>
            ) : null}
          </div>

          <form
            className="border-t border-white/10 bg-black/14 p-3"
            onSubmit={(event) => {
              event.preventDefault()
              void submitQuestion(question)
            }}
          >
            <label className="sr-only" htmlFor="portfolio-question">
              Ask about Yanhua
            </label>
            <textarea
              id="portfolio-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={2}
              placeholder="Ask about Yanhua’s projects, backend work, cloud experience, or technical support skills..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-dark-bg/72 px-4 py-3 text-sm text-text-light outline-none placeholder:text-text-light/38"
            />
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="max-w-[13rem] text-xs leading-5 text-text-light/48">
                Grounded answers only. If something isn’t in the source content,
                the assistant will say so.
              </p>
              <button
                type="submit"
                disabled={isPending || !question.trim()}
                className="shrink-0 rounded-full bg-accent px-5 py-2 text-sm font-medium text-dark-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Send
              </button>
            </div>
            {error ? <p className="mt-3 text-sm text-amber-300">{error}</p> : null}
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`pointer-events-auto flex items-center gap-3 rounded-full border border-white/12 bg-dark-bg px-3 py-3 text-sm font-medium text-text-light shadow-[0_18px_60px_rgba(15,23,42,0.32)] transition hover:brightness-110 md:px-4 ${
          isOpen ? "bg-dark-bg/88" : "bg-[linear-gradient(135deg,#111827,#1f2937)]"
        }`}
        aria-label={isOpen ? "Minimize chatbot" : "Open chatbot"}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-lg text-dark-bg">
          ✦
        </span>
        <span className="hidden md:inline">
          {isOpen ? "Minimize chat" : "Chat with Yanhua"}
        </span>
      </button>
    </div>
  )
}
