import { Header } from '../components/layout/Header'
import { HeroSection } from '../components/landing/HeroSection'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { WhyLLCSection } from '../components/landing/WhyLLCSection'
import { PricingSection } from '../components/landing/PricingSection'
import { ProcessSection } from '../components/landing/ProcessSection'
import { SuccessStoriesSection } from '../components/landing/SuccessStoriesSection'
import { FAQSection } from '../components/landing/FAQSection'
import { PartnersSection } from '../components/landing/PartnersSection'
import { Footer } from '../components/layout/Footer'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WhyLLCSection />
        <PricingSection />
        <ProcessSection />
        <SuccessStoriesSection />
        <FAQSection />
        <PartnersSection />
      </main>
      <Footer />
    </div>
  )
}