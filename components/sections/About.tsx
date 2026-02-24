import SectionTitle from "@/components/SectionTitle"
import { PortableText } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"

export default function About({ about }: { about?: PortableTextBlock[] }) {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-start">
      <div>
        <SectionTitle title="About Me" />
        <div className="prose prose-slate max-w-none text-justify [&>p]:mb-2">
          {about?.length ? (
            <PortableText value={about} />
          ) : (
            <p>Add your About content in Sanity Studio.</p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white/40 p-8 shadow-sm">
        <div className="text-6xl leading-none text-black/30">“</div>
        <div className="mt-2 font-serif text-2xl text-black/80">
          I like building products that feel fast, simple, and reliable.
        </div>
        <div className="mt-6 text-sm text-black/60">
          Frontend Development · Backend Development · Cloud Computing · Version Control · Database  
        </div>
      </div>
    </div>
  )
}