export default function Hero() {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-start">
      <div className="pt-10">
        <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-7xl">
          Full Stack
          <br />
          Software
          <br />
          Developer.
        </h1>

        
      </div>

      {/* Right side placeholder (later: skill cloud / illustration) */}
      <div className="hidden md:block">
        <div className="relative h-[360px] rounded-3xl border border-text-dark/10 bg-white/30" />
      </div>
    </div>
  )
}