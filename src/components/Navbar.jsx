import { motion } from 'framer-motion';

const links = ['Experience', 'Suites', 'Gallery', 'Contact'];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="fixed left-1/2 top-5 z-50 w-[92%] max-w-6xl -translate-x-1/2"
    >
      <nav className="glass shadow-glass rounded-full px-4 py-3 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <a href="#hero" className="font-display text-lg tracking-[0.18em] text-champagne">
            AURUM HAVEN
          </a>
          <ul className="hidden items-center gap-8 text-sm tracking-[0.16em] text-champagne/80 md:flex">
            {links.map((link) => (
              <li key={link}>
                <a href={`#${link.toLowerCase()}`} className="transition hover:text-gold">
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <a href="#booking" className="luxury-btn hidden md:inline-flex">
            Reserve
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
