export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-text-dark/10 bg-light-bg/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-semibold tracking-tight text-text-dark">
          Yanhua He
        </a>
        <div className="hidden gap-6 text-sm md:flex">
          <a href="#about" className="text-text-dark hover:text-primary transition">About</a>
          <a href="#experience" className="text-text-dark hover:text-primary transition">Experience</a>
          <a href="#skills" className="text-text-dark hover:text-primary transition">Skills</a>
          <a href="#projects" className="text-text-dark hover:text-primary transition">Projects</a>
          <a href="#contact" className="text-text-dark hover:text-primary transition">Contact</a>
        </div>
      </nav>
    </header>
  )
}