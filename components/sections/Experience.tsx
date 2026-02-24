import SectionTitle from "@/components/SectionTitle"

type Exp = {
  role: string
  company: string
  date: string
  bullets: string[]
}

const experiences: Exp[] = [
  {
    role: "Backend Developer (Co-op)",
    company: "AI Financial",
    date: "Jan 2024 — Apr 2024",
    bullets: [
      "Built a Spring Boot backend to process 4,000+ Excel records and automate PDF filling.",
      "Created validation pipelines that reduced data entry errors and improved reliability.",
      "Added centralized logging/monitoring to speed up debugging and improve uptime.",
    ],
  },
  {
    role: "Frontend Media Developer (Co-op)",
    company: "Centennial College",
    date: "Sept 2024 — Dec 2024",
    bullets: [
      "Maintained 80+ pages of accessible web content (W3C compliance).",
      "Built responsive React pages to improve mobile usability.",
      "Worked in Agile sprints with standups/reviews and on-time delivery.",
    ],
  },
]

function ExperienceCard({ exp }: { exp: Exp }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/5 p-8 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="text-lg font-semibold">{exp.role}</div>
        <div className="text-white/70">
          {exp.company} · <span className="text-white/50">{exp.date}</span>
        </div>
      </div>

      <ul className="mt-5 space-y-2 text-white/80">
        {exp.bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/70" />
            <span className="leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Experience() {
  return (
    <div>
      <SectionTitle title="Experiences" theme="dark" />
      <div className="grid gap-6 md:grid-cols-2">
        {experiences.map((exp) => (
          <ExperienceCard key={exp.role} exp={exp} />
        ))}
      </div>
    </div>
  )
}