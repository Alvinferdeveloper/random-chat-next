"use client"

import { useEffect, useState } from "react"

function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return prefersReduced
}

interface Particle {
  size: number
  duration: number
  delay: number
  animClass: number
}

export default function AnimatedBackground() {
  const prefersReduced = useReducedMotion()
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const count = window.innerWidth < 768 ? 6 : 20
    const newParticles = Array.from({ length: count }, () => ({
      size: Math.random() * 6 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      animClass: Math.floor(Math.random() * 3),
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background dark:to-emerald-950/30 to-emerald-100/50" />

      {/* Noise texture overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.015] dark:opacity-[0.03]"
        aria-hidden="true"
      >
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {!prefersReduced && (
        <>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] dark:bg-emerald-500/5 bg-emerald-300/20 rounded-full blur-[120px] max-md:blur-[60px] animate-blob-1" />

          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] dark:bg-[#D6F045]/5 bg-lime-200/30 rounded-full blur-[100px] max-md:blur-[50px] animate-blob-2" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-[800px] max-md:w-[500px] h-[800px] max-md:h-[500px] dark:from-emerald-500/5 dark:to-[#D6F045]/5 bg-gradient-to-tr from-emerald-200/30 to-teal-100/40 rounded-full blur-[150px] max-md:blur-[80px] animate-blob-3" />
          </div>

          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute rounded-full dark:bg-emerald-400/30 bg-emerald-500/70 max-md:hidden"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: particle.size,
                height: particle.size,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
                animationName: `particle-float-${particle.animClass}`,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}
