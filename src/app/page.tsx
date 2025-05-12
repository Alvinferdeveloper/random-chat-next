import HeroSection from "@/components/pages/main/HeroSection"
import FeaturesSection from "@/components/pages/main/FeaturesSection"
import CtaSection from "@/components/pages/main/CtaSection"

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-5">
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </main>
  )
}
