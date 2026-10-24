import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { UtensilsCrossed, MapPin, CheckCircle2, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="bg-deep-charcoal py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-champagne text-sm uppercase tracking-[0.3em] mb-4">About Us</p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-4">
            Star Family Restaurant
          </h1>
          <p className="text-white/70 text-lg">
            Authentic Indian cuisine in the heart of Hanamkonda, Telangana
          </p>
        </div>
      </div>

      <div className="flex-1 bg-warm-white py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <section>
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              Star Family Restaurant is a local dining establishment in Hanamkonda, Telangana,
              serving authentic Indian cuisine with a focus on the rich culinary traditions of
              the region. From our signature biryanis to our tandoori specialties, every dish
              is prepared fresh with care and the finest ingredients.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-4">What We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-ivory border border-border rounded-md p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-3">
                  <UtensilsCrossed className="w-6 h-6 text-champagne-dark" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">Dine-In</h3>
                <p className="text-sm text-muted-foreground">Comfortable seating for families and groups</p>
              </div>
              <div className="bg-ivory border border-border rounded-md p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-champagne-dark" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">Takeaway</h3>
                <p className="text-sm text-muted-foreground">Order ahead and pick up fresh</p>
              </div>
              <div className="bg-ivory border border-border rounded-md p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-champagne-dark" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">Made Fresh</h3>
                <p className="text-sm text-muted-foreground">Prepared to order with quality ingredients</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-4">Location</h2>
            <div className="bg-ivory border border-border rounded-md p-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-champagne-dark shrink-0 mt-0.5" />
                <div>
                  <p className="text-charcoal font-medium">
                    27-10-104/2, near KITS College Basketball Court,<br />
                    Hanamkonda, Koukonda, Telangana 506371
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Address is provided as-is and should be verified with the owner before publication.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-accent/50 border border-border rounded-md p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Home delivery and online payment are not available in this release.
              Please visit us for dine-in or place a takeaway order.
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
