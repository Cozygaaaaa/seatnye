import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';

export default function AboutSection() {
  return (
    <section id="about" className="section-shell py-24 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9 }}
          className="overflow-hidden rounded-[2rem]"
        >
          <img
            src="https://images.unsplash.com/photo-1535827841776-24afc1e255ac?auto=format&fit=crop&w=1400&q=80"
            alt="Luxury resort exterior"
            className="h-full min-h-[420px] w-full object-cover"
            loading="lazy"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <SectionTitle eyebrow="Our Story" title="A destination sculpted for timeless indulgence." />
          <p className="mt-7 text-lg leading-relaxed text-champagne/80">
            Hidden between emerald mountains and pristine coastline, Aurum Haven was designed as an intimate
            masterpiece where architecture meets nature. Each residence, ritual, and culinary journey is curated to
            awaken your senses and restore your spirit.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-champagne/80">
            From sunrise spa ceremonies to moonlit private dining, every moment is crafted for guests who seek
            extraordinary beauty, serenity, and personalized elegance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
