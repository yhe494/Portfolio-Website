'use client'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-text-dark/10 bg-light-bg/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-semibold tracking-tight text-text-dark">
          Yanhua He
        </button>
        <div className="hidden gap-6 text-sm md:flex">
          <button onClick={() => scrollTo('about')} className="text-text-dark hover:text-primary transition">About</button>
          <button onClick={() => scrollTo('experience')} className="text-text-dark hover:text-primary transition">Experience</button>
          <button onClick={() => scrollTo('skills')} className="text-text-dark hover:text-primary transition">Skills</button>
          <button onClick={() => scrollTo('projects')} className="text-text-dark hover:text-primary transition">Projects</button>
          <button onClick={() => scrollTo('contact')} className="text-text-dark hover:text-primary transition">Contact</button>
        </div>
      </nav>
    </header>
  )
}
