import { motion } from 'framer-motion';
import { experiences } from '../data/content';
import SectionTitle from './SectionTitle';

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="section-shell">
        <SectionTitle eyebrow="Experiences" title="Designed for unforgettable stories." />
      </div>
      <div className="mt-12 overflow-x-auto pb-3">
        <div className="section-shell flex min-w-max gap-6 pr-16">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="group glass flex h-72 w-[290px] flex-col justify-between rounded-[1.7rem] p-7"
            >
              <span className="text-4xl text-gold/85">✦</span>
              <h3 className="font-display text-3xl leading-tight text-champagne">{exp}</h3>
              <p className="text-sm uppercase tracking-[0.2em] text-champagne/60 transition group-hover:text-gold">
                Discover
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
