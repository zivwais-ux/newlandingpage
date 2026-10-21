import { Reveal } from "@/components/Reveal";
import { About } from "@/components/sections/About";
import { Build } from "@/components/sections/Build";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { How } from "@/components/sections/How";
import { Intro } from "@/components/sections/Intro";
import { Pain } from "@/components/sections/Pain";
import { Testimonials } from "@/components/sections/Testimonials";
import { validateContent } from "@/lib/content";

export default function Home() {
  // תוכן לא תקין מכשיל את הבנייה כאן, לפני שהדף יוצא לאוויר.
  validateContent();
  return (
    <>
      <Hero />
      <main id="main">
        <Intro />
        <Pain />
        <Build />
        <How />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
