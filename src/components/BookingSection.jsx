import { motion } from 'framer-motion';

export default function BookingSection() {
  return (
    <section id="booking" className="section-shell py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-[#151311] via-[#0d0c0b] to-[#16120d] px-8 py-16 text-center shadow-luxe md:px-16"
      >
        <div className="absolute inset-0 bg-grain opacity-70" />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Begin Your Journey</p>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl leading-tight text-champagne md:text-6xl">
            Reserve Your Private Escape
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-champagne/75">
            Secure your dates for an exceptional stay crafted around your rhythm, preferences, and dreams.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button className="luxury-btn-primary">Book Now</button>
            <a href="https://wa.me/10000000000" className="luxury-btn-ghost" target="_blank" rel="noreferrer">
              WhatsApp Concierge
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
