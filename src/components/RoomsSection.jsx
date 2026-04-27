import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import { rooms } from '../data/content';

export default function RoomsSection() {
  return (
    <section id="suites" className="bg-graphite/45 py-24 md:py-32">
      <div className="section-shell">
        <SectionTitle eyebrow="Rooms & Suites" title="Curated residences for every chapter of your journey." />
        <div className="mt-12 grid gap-7 md:grid-cols-2">
          {rooms.map((room, idx) => (
            <motion.article
              key={room.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: idx * 0.08 }}
              className="group overflow-hidden rounded-[1.8rem] border border-champagne/15 bg-obsidian/70 shadow-luxe"
            >
              <div className="overflow-hidden">
                <img
                  src={room.image}
                  alt={room.title}
                  className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-7">
                <h3 className="font-display text-3xl text-champagne">{room.title}</h3>
                <p className="mt-3 text-champagne/75">{room.description}</p>
                <button className="mt-6 text-sm uppercase tracking-[0.2em] text-gold transition hover:text-champagne">
                  View Details
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
