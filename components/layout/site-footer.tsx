import Link from 'next/link';
import { UtensilsCrossed, MapPin, Clock, Phone } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="w-5 h-5 text-champagne" />
              <div className="flex flex-col leading-none">
                <span className="font-serif text-lg font-bold text-white">
                  Star Family
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-champagne">
                  Restaurant
                </span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Authentic Indian cuisine in Hanamkonda, Telangana.
              Biryani, curries, tandoori, and more — dine-in or takeaway.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold text-champagne mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/menu" className="hover:text-champagne transition-colors">Menu</Link></li>
              <li><Link href="/cart" className="hover:text-champagne transition-colors">Cart</Link></li>
              <li><Link href="/about" className="hover:text-champagne transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-champagne transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold text-champagne mb-4 uppercase tracking-wider">
              Visit Us
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-champagne mt-0.5 shrink-0" />
                <span>
                  27-10-104/2, near KITS College Basketball Court,<br />
                  Hanamkonda, Koukonda, Telangana 506371
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-champagne shrink-0" />
                <span>Hours pending owner confirmation</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-champagne shrink-0" />
                <span>Phone pending owner confirmation</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-divider my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} Star Family Restaurant. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-champagne transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-champagne transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
