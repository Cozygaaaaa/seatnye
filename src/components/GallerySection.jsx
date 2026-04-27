import { motion } from 'framer-motion';
import { gallery } from '../data/content';
import SectionTitle from './SectionTitle';

export default function GallerySection() {
  return (
    <section id="gallery" className="bg-graphite/35 py-24 md:py-32">
      <div className="section-shell">
        <SectionTitle eyebrow="Gallery" title="A cinematic glimpse into your private escape." />
        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {gallery.map((image, idx) => (
            <motion.figure
              key={image}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: idx * 0.04 }}
              className="group relative mb-6 overflow-hidden rounded-[1.5rem]"
            >
              <img
                src={image}
                alt={`Luxury gallery ${idx + 1}`}
                className="w-full transition duration-700 group-hover:scale-110 group-hover:brightness-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/50 to-transparent opacity-60" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
