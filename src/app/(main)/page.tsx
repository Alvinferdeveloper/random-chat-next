"use client"

import { useRef } from "react"
import HeroSection from "@/src/app/(main)/components/HeroSection"
import FeaturesSection from "@/src/app/(main)/components/FeaturesSection"
import CtaSection from "@/src/app/(main)/components/CtaSection"
import ScrollConnector from "@/src/app/(main)/components/ScrollConnector"
import AnimatedBackground from "@/src/app/(main)/components/AnimatedBackground"

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const sections = [
    { id: "hero", ref: heroRef },
    { id: "features", ref: featuresRef },
    { id: "cta", ref: ctaRef },
  ]

  return (
    <main className="min-h-screen  px-5">
      <AnimatedBackground />
      <ScrollConnector sections={sections} />
      <HeroSection ref={heroRef} />
      <FeaturesSection ref={featuresRef} />
      <CtaSection ref={ctaRef} />
    </main>
  )
}
