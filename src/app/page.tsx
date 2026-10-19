import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { About } from "@/components/sections/About";
import { Examples } from "@/components/sections/Examples";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pain } from "@/components/sections/Pain";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Pain />
        <Examples />
        <HowItWorks />
        <About />
        <Pricing />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
