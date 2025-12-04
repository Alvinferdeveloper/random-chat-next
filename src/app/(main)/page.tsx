import HeroSection from "@/src/app/(main)/components/HeroSection"
import FeaturesSection from "@/src/app/(main)/components/FeaturesSection"
import CtaSection from "@/src/app/(main)/components/CtaSection"

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-5">
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </main>
  )
}
