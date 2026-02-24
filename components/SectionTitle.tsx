export default function SectionTitle({
  title,
  theme = "light",
}: {
  title: string
  theme?: "light" | "dark"
}) {
  const line = theme === "dark" ? "bg-accent/60" : "bg-text-dark/30"
  const text = theme === "dark" ? "text-text-light" : "text-text-dark"

  return (
    <div className={`mb-10 text-center ${text}`}>
      <h2 className="font-serif text-5xl tracking-widest">
        {title.toUpperCase()}
      </h2>
      <div className="mt-6 flex items-center justify-center gap-6">
        <span className={`h-px w-28 ${line}`} />
        <span className="text-accent text-sm">▼</span>
        <span className={`h-px w-28 ${line}`} />
      </div>
    </div>
  )
}