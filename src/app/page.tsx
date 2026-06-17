import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Generator } from "@/components/Generator";
import { Header } from "@/components/Header";
import { Landing } from "@/components/Landing";
import { ContactSection, FeaturesSection, ScreenshotsSection, TemplatesPreviewSection, TestimonialsSection } from "@/components/MarketingSections";
import { Pricing } from "@/components/Pricing";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Landing />
        <FeaturesSection />
        <TemplatesPreviewSection />
        <Generator />
        <ScreenshotsSection />
        <TestimonialsSection />
        <Pricing />
        <Faq />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
