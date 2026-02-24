type SiteSettings = {
  email?: string
  github?: string
  linkedin?: string
}

export default function Contact({ settings }: { settings: SiteSettings }) {
  return (
    <div className="text-center">
      <h2 className="font-serif text-4xl">Get In Touch</h2>
      <p className="mt-4 text-lg opacity-70 max-w-xl mx-auto">
        I&apos;m always open to new opportunities and collaborations. Feel free to reach out!
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-5">
        {settings?.email && (
          <a
            href={`mailto:${settings.email}`}
            className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-white/60 px-6 py-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-lg transition group-hover:bg-black/10">
              ✉️
            </span>
            <div className="text-left">
              <div className="text-xs font-medium uppercase tracking-wider opacity-50">Email</div>
              <div className="font-medium">{settings.email}</div>
            </div>
          </a>
        )}

        {settings?.github && (
          <a
            href={settings.github}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-white/60 px-6 py-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-lg transition group-hover:bg-black/10">
              💻
            </span>
            <div className="text-left">
              <div className="text-xs font-medium uppercase tracking-wider opacity-50">GitHub</div>
              <div className="font-medium">GitHub Profile</div>
            </div>
          </a>
        )}

        {settings?.linkedin && (
          <a
            href={settings.linkedin}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-white/60 px-6 py-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-lg transition group-hover:bg-black/10">
              🔗
            </span>
            <div className="text-left">
              <div className="text-xs font-medium uppercase tracking-wider opacity-50">LinkedIn</div>
              <div className="font-medium">LinkedIn Profile</div>
            </div>
          </a>
        )}
      </div>
    </div>
  )
}