'use client'

import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium tracking-wider text-text-dark/70 shadow-md backdrop-blur transition hover:bg-white hover:text-text-dark hover:shadow-lg md:bottom-8 md:right-6"
    >
      BACK TO TOP <span className="text-lg">↑</span>
    </button>
  )
}
