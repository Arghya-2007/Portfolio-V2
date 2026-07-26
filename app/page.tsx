// app/page.tsx
// Phase 3 — Server Component.
// Navbar is now a floating pill — no pt-14 offset needed.
// Sections are full-bleed (relative + overflow-hidden) with their own backgrounds.

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Timeline from '@/components/sections/Timeline';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/*
          No pt-14 offset — Navbar is now a floating pill that overlaps
          the hero (hero has its own pt-24 to clear the pill).
          Each section handles its own background image and padding.
        */}
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
