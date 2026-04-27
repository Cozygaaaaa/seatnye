import { motion } from 'framer-motion';

export default function SectionTitle({ eyebrow, title, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.8 }}
      className={className}
    >
      <p className="mb-3 text-xs uppercase tracking-[0.32em] text-gold/90">{eyebrow}</p>
      <h2 className="font-display text-4xl leading-tight text-champagne md:text-5xl">{title}</h2>
    </motion.div>
  );
}
