'use client'

import { PortableText } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"

type ProjectItem = {
  title?: string
  summary?: PortableTextBlock[] | string
  techStack?: string[]
  github?: string
  featured?: boolean
}

export default function Projects({ projects }: { projects: ProjectItem[] }) {
  return (
    <div>
      <h2 className="font-serif text-4xl">Projects</h2>
      <div className="mt-6 grid gap-6">
        {projects?.map((p, i) => (
          <div key={i} className="rounded-2xl border border-white/15 bg-white/5 p-6">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">
                {p.title}
                {p.techStack?.length ? (
                  <span className="font-normal opacity-70">{' | '}{p.techStack.join(', ')}</span>
                ) : null}
              </h3>
              {p.featured ? <span className="text-sm opacity-70">(Featured)</span> : null}
            </div>
            {p.summary && (
              <div className="mt-2 opacity-80 prose prose-invert max-w-none text-justify [&_ul]:list-disc [&_ul]:pl-5">
                {typeof p.summary === 'string' ? (
                  <p>{p.summary}</p>
                ) : (
                  <PortableText value={p.summary} />
                )}
              </div>
            )}
            {p.github ? (
              <a className="mt-4 inline-block underline opacity-80" href={p.github} target="_blank" rel="noreferrer">
                Source Code
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}