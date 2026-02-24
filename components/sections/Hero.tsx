type SiteSettings = {
  heroTitle?: string
  heroSubtitle?: string
}

export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <div className="py-10">
      <h1 className="font-serif text-5xl md:text-7xl">
        {settings?.heroTitle ?? "Full Stack Software Developer."}
      </h1>
      <p className="mt-4 text-black/60">
        {settings?.heroSubtitle ?? "Based in Toronto. I build web apps end-to-end."}
      </p>
    </div>
  )
}