import SectionTitle from "@/components/SectionTitle"

export default function About() {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-start">
      <div>
        <SectionTitle title="About Me" />
        <p className="text-black/70 leading-relaxed">
          I’m a full-stack developer in Toronto with experience building web apps
          end-to-end — from responsive UI to backend APIs and databases. I’ve
          worked with React, Node.js, Java Spring Boot, and Python (FastAPI),
          and I enjoy turning messy requirements into clean, working features.
        </p>

        <p className="mt-4 text-black/70 leading-relaxed">
          Recently, I built a real-time chat application with WebSockets + JWT,
          and a backend automation tool that processed thousands of records to
          reduce manual work.
        </p>
      </div>

      {/* “Quote card” vibe */}
      <div className="rounded-3xl border border-black/10 bg-white/40 p-8 shadow-sm">
        <div className="text-6xl leading-none text-black/30">“</div>
        <div className="mt-2 font-serif text-2xl text-black/80">
          I like building products that feel fast, simple, and reliable.
        </div>
        <div className="mt-6 text-sm text-black/60">
          Focus: React · Node.js · Java · Python · PostgreSQL
        </div>
      </div>
    </div>
  )
}