import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import RoomsSection from './components/RoomsSection';
import ExperienceSection from './components/ExperienceSection';
import GallerySection from './components/GallerySection';
import TestimonialsSection from './components/TestimonialsSection';
import BookingSection from './components/BookingSection';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function LuxuryLoading({ hidden }) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-40 bg-obsidian transition-opacity duration-1000 ${
        hidden ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-gold animate-shimmer" />
        <div className="h-3 w-3 rounded-full bg-champagne animate-shimmer [animation-delay:0.2s]" />
        <div className="h-3 w-3 rounded-full bg-gold animate-shimmer [animation-delay:0.4s]" />
      </div>
    </div>
  );
}

export default function App() {
  const appRef = useRef(null);
  const [loadingDone, setLoadingDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingDone(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      smoothWheel: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const sections = gsap.utils.toArray('section');
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0.65, scale: 0.985 },
        {
          opacity: 1,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 45%',
            scrub: true,
          },
        },
      );
    });

    gsap.to('#hero video', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        scrub: true,
        start: 'top top',
        end: 'bottom top',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((instance) => instance.kill());
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <LuxuryLoading hidden={loadingDone} />
      <main ref={appRef} className="bg-obsidian">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <RoomsSection />
        <ExperienceSection />
        <GallerySection />
        <TestimonialsSection />
        <BookingSection />
        <Footer />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Resort',
            name: 'Aurum Haven',
            description: 'Luxury resort and villa destination offering private curated experiences.',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'US',
            },
          }),
        }}
      />
    </>
  );
}
