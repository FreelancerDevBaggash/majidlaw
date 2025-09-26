import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { SkillsSection } from "@/components/skills-section"
import { CasesTimeline } from "@/components/cases-timeline"
import { BlogPreviewSection } from "@/components/blog-preview-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { ScrollIndicator } from "@/components/scroll-indicator"
import { ParticleBackground } from "@/components/particle-background"
import { WhatsAppFloat } from "@/components/whatsapp-float"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background relative">
      <ScrollIndicator />
      <ParticleBackground />
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <SkillsSection />
      <CasesTimeline />
      <BlogPreviewSection />
      <ContactSection />
      <Footer />
      <WhatsAppFloat />
    </main>
  )
}
