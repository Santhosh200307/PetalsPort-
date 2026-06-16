import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-[#1A2F24] text-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="font-serif-display text-5xl md:text-7xl leading-[0.95]">
              Bring the<br />
              <span className="italic text-[#E5E0D8]">garden</span> indoors.
            </div>
            <p className="mt-8 text-[#E5E0D8]/80 max-w-md leading-relaxed">
              Wholesale & retail florals shipped chilled to events across India.
              Subscribe for seasonal lookbooks and member-only pricing.
            </p>
            <form
              data-testid="footer-newsletter-form"
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex items-center max-w-md border-b border-[#E5E0D8]/40 pb-3"
            >
              <input
                data-testid="footer-newsletter-input"
                type="email"
                required
                placeholder="your@email.com"
                className="bg-transparent flex-1 outline-none placeholder:text-[#E5E0D8]/50 py-2"
              />
              <button data-testid="footer-newsletter-submit" className="text-sm uppercase tracking-[0.2em] hover:text-[#8C2131] transition-colors">
                Subscribe →
              </button>
            </form>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] text-[#E5E0D8]/60 mb-4">Shop</div>
            <ul className="space-y-3 text-[#E5E0D8]">
              <li><Link to="/catalog" className="hover:text-[#8C2131] transition-colors">Catalog</Link></li>
              <li><Link to="/category/wedding" className="hover:text-[#8C2131] transition-colors">Wedding</Link></li>
              <li><Link to="/category/birthday" className="hover:text-[#8C2131] transition-colors">Birthday</Link></li>
              <li><Link to="/category/corporate" className="hover:text-[#8C2131] transition-colors">Corporate</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] text-[#E5E0D8]/60 mb-4">Studio</div>
            <ul className="space-y-3 text-[#E5E0D8]">
              <li><Link to="/about" className="hover:text-[#8C2131] transition-colors">About</Link></li>
              <li><Link to="/quote" className="hover:text-[#8C2131] transition-colors">Bulk Quote</Link></li>
              <li><Link to="/contact" className="hover:text-[#8C2131] transition-colors">Contact</Link></li>
              <li><Link to="/cart" className="hover:text-[#8C2131] transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[0.2em] text-[#E5E0D8]/60 mb-4">Reach us</div>
            <ul className="space-y-3 text-[#E5E0D8]">
              <li className="flex items-center gap-3"><Phone size={16} /> +91 98xxx xxxxx</li>
              <li className="flex items-center gap-3"><Mail size={16} /> hello@petalsport.in</li>
              <li className="flex items-center gap-3"><MapPin size={16} /> KR Market, Bengaluru</li>
              <li className="flex items-center gap-3"><Instagram size={16} /> @petalsport</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-[#E5E0D8]/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-[#E5E0D8]/60">
          <div>© {new Date().getFullYear()} PetalsPort Florals Pvt. Ltd. — All florals, freshly sourced.</div>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
