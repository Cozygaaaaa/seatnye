import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import { testimonials } from '../data/content';

export default function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="section-shell">
        <SectionTitle eyebrow="Testimonials" title="Guests who found their extraordinary." />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, idx) => (
            <motion.blockquote
              key={item.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: idx * 0.1 }}
              className="glass rounded-[1.4rem] p-8"
            >
              <p className="font-display text-2xl leading-relaxed text-champagne">“{item.quote}”</p>
              <footer className="mt-6 text-sm uppercase tracking-[0.2em] text-gold">{item.name}</footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
