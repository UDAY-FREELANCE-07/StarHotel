import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { MapPin, Clock, Phone, Mail, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="bg-deep-charcoal py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-champagne text-sm uppercase tracking-[0.3em] mb-4">Contact</p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white">
            Get in Touch
          </h1>
        </div>
      </div>

      <div className="flex-1 bg-warm-white py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-ivory border border-border rounded-md p-6">
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-5 h-5 text-champagne-dark shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-base font-semibold text-charcoal mb-1">Address</h3>
                  <p className="text-sm text-muted-foreground">
                    27-10-104/2, near KITS College Basketball Court,<br />
                    Hanamkonda, Koukonda, Telangana 506371
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-ivory border border-border rounded-md p-6">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="w-5 h-5 text-champagne-dark shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-base font-semibold text-charcoal mb-1">Hours</h3>
                  <p className="text-sm text-muted-foreground">Pending owner confirmation</p>
                </div>
              </div>
            </div>

            <div className="bg-ivory border border-border rounded-md p-6">
              <div className="flex items-start gap-3 mb-3">
                <Phone className="w-5 h-5 text-champagne-dark shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-base font-semibold text-charcoal mb-1">Phone</h3>
                  <p className="text-sm text-muted-foreground">Pending owner confirmation</p>
                </div>
              </div>
            </div>

            <div className="bg-ivory border border-border rounded-md p-6">
              <div className="flex items-start gap-3 mb-3">
                <Mail className="w-5 h-5 text-champagne-dark shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-base font-semibold text-charcoal mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">Pending owner confirmation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 border border-border rounded-md p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-champagne-dark shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif text-base font-semibold text-charcoal mb-1">
                  Contact details pending verification
                </h3>
                <p className="text-sm text-muted-foreground">
                  Phone number, email, opening hours, and the official map link for this restaurant
                  will be displayed here once confirmed by the owner. Please visit us at the address above.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white border border-border rounded-md p-6">
            <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">Ordering Options</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Place an order online for dine-in or takeaway. Payment is collected at the restaurant.
            </p>
            <div className="flex gap-3">
              <a
                href="/menu"
                className="inline-flex items-center justify-center bg-champagne hover:bg-champagne-dark text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
              >
                Order Now
              </a>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
