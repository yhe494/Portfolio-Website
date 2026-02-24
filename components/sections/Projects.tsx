import SectionTitle from "@/components/SectionTitle"

type Project = {
  title: string
  stack: string[]
  description: string
  github?: string
}

const projects: Project[] = [
  {
    title: "Real-Time Chat Application",
    stack: ["React", "FastAPI", "WebSockets", "PostgreSQL", "JWT"],
    description:
      "Full-stack messaging app with real-time presence, typing indicators, reactions, and reliable reconnection logic.",
    github: "https://github.com/yourname/your-repo",
  },
  {
    title: "Culinary Portfolio Builder",
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    description:
      "Team project with secure REST APIs and authentication; optimized queries with indexes for better performance.",
    github: "https://github.com/yourname/your-repo",
  },
  {
    title: "Podcast Platform",
    stack: ["ASP.NET Core", "AWS", "SQL Server", "S3", "DynamoDB"],
    description:
      "Role-based podcast platform deployed on AWS with uploads, comments, analytics tracking, and CI/CD workflow.",
    github: "https://github.com/yourname/your-repo",
  },
]

function ProjectCard({ p }: { p: Project }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/5 p-8 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-2xl font-semibold">{p.title}</h3>
          <p className="mt-3 text-white/75 leading-relaxed">{p.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80"
              >
                {s}
              </span>
            ))}
          </div>

          {p.github && (
            <div className="mt-6">
              <a
                className="text-sm underline text-white/80 hover:text-white"
                href={p.github}
                target="_blank"
                rel="noreferrer"
              >
                Source Code
              </a>
            </div>
          )}
        </div>

        {/* optional “image placeholder” block to mimic screenshot */}
        <div className="hidden md:block h-28 w-28 rounded-2xl border border-white/10 bg-white/10" />
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <div>
      <SectionTitle title="Projects" theme="dark" />
      <div className="grid gap-6">
        {projects.map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}
      </div>
    </div>
  )
}