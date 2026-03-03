import Navbar from "@/components/Navbar"
import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Experience from "@/components/sections/Experience"
import Skills from "@/components/sections/Skills"
import Projects from "@/components/sections/Projects"
import Contact from "@/components/sections/Contact"
import BackToTop from "@/components/BackToTop"

import { client } from "@/sanity/lib/client"
import { siteSettingsQuery, experiencesQuery, projectsQuery } from "@/sanity/lib/queries"

export const revalidate = 60 
function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-6">{children}</div>
}

export default async function Home() {
  const [settings, experiences, projects] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(experiencesQuery),
    client.fetch(projectsQuery),
  ])

  return (
    <div className="bg-light-bg text-text-dark">
      <a id="top" />
      <Navbar />

      {/* HERO */}
      <section className="pt-14 pb-16">
        <Container>
          <Hero settings={settings} />
        </Container>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 border-t border-text-dark/10">
        <Container>
          <div className="rounded-3xl border border-text-dark/10 bg-white/40 p-8 md:p-12 shadow-sm">
            <About about={settings?.about} />
          </div>
        </Container>
      </section>

      {/* EXPERIENCE (dark band) */}
      <section id="experience" className="bg-dark-bg text-text-light py-20">
        <Container>
          <Experience experiences={experiences} />
        </Container>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-20 border-t border-text-dark/10">
        <Container>
          <Skills />
        </Container>
      </section>

      {/* PROJECTS (dark band) */}
      <section id="projects" className="bg-dark-bg text-text-light py-20">
        <Container>
          <Projects projects={projects} />
        </Container>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 border-t border-text-dark/10">
        <Container>
          <div className="rounded-3xl border border-text-dark/10 bg-white/40 p-8 md:p-12 shadow-sm">
            <Contact settings={settings} />
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-sm text-text-dark/50 border-t border-text-dark/10">
        <Container>© {new Date().getFullYear()} Yanhua He</Container>
      </footer>

      <BackToTop />
    </div>
  )
}