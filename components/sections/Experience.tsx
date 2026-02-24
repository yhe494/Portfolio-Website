type ExperienceItem = {
  role?: string
  company?: string
  location?: string
  startDate?: string
  endDate?: string
  highlights?: string[]
  tech?: string[]
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  return (
    <div>
      <h2 className="font-serif text-4xl">Experience</h2>
      <ul className="mt-6 space-y-6">
        {experiences?.map((e, i) => (
          <li key={i} className="rounded-2xl border border-white/15 bg-white/5 p-6">
            <div className="flex items-baseline justify-between gap-4">
              <div className="font-semibold">{e.role}</div>
              <div className="shrink-0 text-sm opacity-60">
                {e.startDate && formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : 'Present'}
              </div>
            </div>
            <div className="opacity-70">{e.company}{e.location ? `, ${e.location}` : ''}</div>
            <ul className="mt-3 list-disc pl-5 opacity-90">
              {e.highlights?.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}