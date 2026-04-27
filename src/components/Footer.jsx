export default function Footer() {
  return (
    <footer id="contact" className="border-t border-champagne/10 py-14">
      <div className="section-shell grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl text-champagne">AURUM HAVEN</h3>
          <p className="mt-4 text-sm text-champagne/65">Crafted for quiet luxury, soulful restoration, and timeless memories.</p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-gold">Contact</h4>
          <p className="mt-4 text-sm text-champagne/70">reservations@aurumhaven.com</p>
          <p className="mt-2 text-sm text-champagne/70">+1 (555) 777 2026</p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-gold">Social</h4>
          <ul className="mt-4 space-y-2 text-sm text-champagne/70">
            <li>Instagram</li>
            <li>Youtube</li>
            <li>Pinterest</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-gold">Newsletter</h4>
          <div className="mt-4 flex rounded-full border border-champagne/20 px-3 py-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-transparent text-sm text-champagne outline-none placeholder:text-champagne/45"
            />
            <button className="text-xs uppercase tracking-[0.2em] text-gold">Join</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
