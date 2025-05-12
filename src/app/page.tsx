import HeroSection from "@/app/components/pages/main/HeroSection"
import FeaturesSection from "@/app/components/pages/main/FeaturesSection"
import CtaSection from "@/app/components/pages/main/CtaSection"

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-5">
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </main>
  )
}
