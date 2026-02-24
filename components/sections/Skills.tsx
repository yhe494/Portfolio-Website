import SectionTitle from "../SectionTitle"

const skills = {
  programmingLanguages: ["JavaScript", "TypeScript", "Python", "Java", "C#"],
  frontend: ["React.js", "Vue.js", "Angular.js", "HTML5", "CSS3"],
  backend: ["Node.js", "Express.js", "Spring Boot", "FastAPI", "REST APIs"],
  fullstack: ["Next.js", "ASP.NET Core", "Microservices"],
  database: ["MongoDB", "MySQL", "PostgreSQL", "DynamoDB", "Oracle"],
  tools: ["AWS", "Docker", "GitHub Actions", "Postman", "Git"],
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl bg-white/70 p-8 shadow-lg">
      <div className="mb-4 text-sm font-semibold tracking-widest text-gray-600">
        {title.toUpperCase()}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((x) => (
          <span key={x} className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm">
            {x}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <>
      <SectionTitle title="Skills" />
      <div className="grid gap-6 md:grid-cols-3">
        <Card title="Programming Languages" items={skills.programmingLanguages} />
        <Card title="Frontend" items={skills.frontend} />
        <Card title="Backend" items={skills.backend} />
        <Card title="Fullstack" items={skills.fullstack} />
        <Card title="Database" items={skills.database} />
        <Card title="Tools" items={skills.tools} />

      </div>
    </>
  )
}