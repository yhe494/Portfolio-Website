import SectionTitle from "@/components/SectionTitle"

export default function Contact() {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-start">
      <div>
        <SectionTitle title="Contact" />
        <p className="text-black/70 leading-relaxed">
          Feel free to reach out — I’m open to internships and entry-level
          software roles.
        </p>

        <div className="mt-6 space-y-3 text-black/70">
          <div>
            <span className="font-semibold text-black/80">Email: </span>
            <a className="underline" href="mailto:yhe4940@outlook.com">
              yhe4940@outlook.com
            </a>
          </div>
          <div>
            <span className="font-semibold text-black/80">GitHub: </span>
            <a className="underline" href="https://github.com/yourname" target="_blank" rel="noreferrer">
              github.com/yourname
            </a>
          </div>
          <div>
            <span className="font-semibold text-black/80">LinkedIn: </span>
            <a className="underline" href="https://linkedin.com/in/yourname" target="_blank" rel="noreferrer">
              linkedin.com/in/yourname
            </a>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white/40 p-8 shadow-sm">
        <div className="text-sm tracking-widest text-black/60 uppercase">
          Quick Message
        </div>
        <p className="mt-4 text-black/70">
          If you tell me what role you’re hiring for and what stack you use,
          I’ll reply with relevant projects and availability.
        </p>

        <div className="mt-6 flex gap-3">
          <a
            href="mailto:yhe4940@outlook.com?subject=Portfolio%20Inquiry"
            className="rounded-full border border-black/30 px-6 py-2 text-sm tracking-widest uppercase hover:bg-black/5"
          >
            Email Me
          </a>
          <a
            href="#top"
            className="rounded-full border border-black/30 px-6 py-2 text-sm tracking-widest uppercase hover:bg-black/5"
          >
            Back to Top
          </a>
        </div>
      </div>
    </div>
  )
}