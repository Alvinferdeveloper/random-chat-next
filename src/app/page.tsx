import HeroSection from "@/app/components/pages/main/heroSection"
import FeaturesSection from "@/app/components/pages/main/featuresSection"
import CtaSection from "@/app/components/pages/main/ctaSection"

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-5">
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </main>
  )
}
