import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full scale-[1.08] object-cover"
          poster="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1800&q=80"
        >
          <source src="https://cdn.coverr.co/videos/coverr-luxury-resort-1579/1080p.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/50 via-obsidian/40 to-obsidian" />
      </div>

      <div className="section-shell relative flex min-h-screen flex-col justify-center py-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-5 text-xs uppercase tracking-[0.45em] text-gold"
        >
          Private Sanctuary • Signature Luxury
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="max-w-4xl font-display text-5xl leading-[1.05] text-champagne sm:text-6xl lg:text-7xl"
        >
          Escape <span className="gold-gradient">Beyond Ordinary</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65 }}
          className="mt-6 max-w-2xl text-base text-champagne/80 md:text-lg"
        >
          Experience luxury, nature, and unforgettable moments in one destination.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a href="#experience" className="luxury-btn-primary">
            Explore Experience
          </a>
          <a href="#booking" className="luxury-btn-ghost">
            Book Your Stay
          </a>
        </motion.div>
      </div>
    </section>
  );
}
