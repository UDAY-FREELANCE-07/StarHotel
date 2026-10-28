import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { supabaseBrowser } from '@/lib/supabase-browser';
import type { Category, MenuItem } from '@/lib/types';
import Link from 'next/link';
import { ArrowRight, UtensilsCrossed, MapPin, CheckCircle2, Info, Flame, Leaf, ChefHat } from 'lucide-react';
import { formatPrice } from '@/lib/pricing';
import { Reveal } from '@/components/ui/reveal';
import { FeaturedDishCard } from '@/components/home/featured-dish-card';

const HERO_IMAGE = 'https://images.pexels.com/photos/32825907/pexels-photo-32825907.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';
const EXPERIENCE_IMAGE = 'https://images.pexels.com/photos/37968303/pexels-photo-37968303.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop';
const TANDOORI_IMAGE = 'https://images.pexels.com/photos/9646859/pexels-photo-9646859.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop';

export default async function HomePage() {
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabaseBrowser
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
    supabaseBrowser
      .from('menu_items')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .order('sort_order'),
  ]);

  const featuredItems = (items || [])
    .filter(i => i.is_available && i.price !== null)
    .slice(0, 6);

  const orderableCount = (items || []).filter(i => i.is_available && i.price !== null).length;
  const unpricedCount = (items || []).filter(i => i.price === null).length;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative h-[100vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="Signature biryani dish"
            className="w-full h-full object-cover animate-slow-zoom"
          />
        </div>
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 hero-overlay-side" />

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <p className="text-champagne text-sm uppercase tracking-[0.3em] mb-6 font-medium animate-fade-in-up delay-100">
                Hanamkonda, Telangana
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-[1.1] text-balance animate-fade-in-up delay-200">
                Authentic Flavours.
                <br />
                Unforgettable Moments.
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl leading-relaxed animate-fade-in-up delay-300">
                Discover delicious Indian cuisine, freshly prepared with care. From aromatic biryanis
                to flavourful curries and sizzling tandoori favourites, enjoy food made to bring
                people together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-400">
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 bg-champagne hover:bg-champagne-dark text-white px-8 py-4 rounded-md font-medium transition-all duration-300 hover:shadow-xl hover:shadow-champagne/20 hover:-translate-y-0.5"
                >
                  Explore Menu
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-champagne hover:bg-white/5 text-white px-8 py-4 rounded-md font-medium transition-all duration-300 backdrop-blur-sm"
                >
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 animate-fade-in delay-500">
          <span className="text-white/40 text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-champagne/60 to-transparent" />
        </div>
      </section>

      {/* Menu Status Notice */}
      {unpricedCount > 0 && (
        <div className="bg-charcoal border-b border-champagne/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-champagne shrink-0" />
              <p className="text-xs text-white/70">
                <span className="text-champagne font-medium">{orderableCount} dishes</span> available
                for online ordering · {unpricedCount} dishes available in person only
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <section className="py-20 lg:py-28 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <p className="text-champagne-dark text-sm uppercase tracking-[0.25em] mb-3 font-medium">
              Our Menu
            </p>
            <h2 className="font-serif text-3xl lg:text-5xl font-bold text-charcoal text-balance">
              Explore by Category
            </h2>
            <div className="gold-divider w-24 mx-auto mt-6" />
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
            {(categories || []).map((cat, i) => {
              const count = (items || []).filter(it => it.category_id === cat.id).length;
              return (
                <Reveal key={cat.id} delay={i * 50}>
                  <Link
                    href={`/menu?category=${cat.slug}`}
                    className="group bg-ivory hover:bg-charcoal border border-border rounded-lg p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl block"
                  >
                    <UtensilsCrossed className="w-7 h-7 text-champagne-dark mx-auto mb-3 group-hover:text-champagne group-hover:scale-110 transition-all" />
                    <p className="text-sm font-medium text-charcoal group-hover:text-white leading-tight transition-colors">
                      {cat.name}
                    </p>
                    <p className="text-xs text-muted-foreground group-hover:text-white/60 mt-1 transition-colors">
                      {count} items
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      {featuredItems.length > 0 && (
        <section className="py-20 lg:py-28 bg-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14">
              <p className="text-champagne-dark text-sm uppercase tracking-[0.25em] mb-3 font-medium">
                Chef&apos;s Selection
              </p>
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-charcoal text-balance">
                Featured Dishes
              </h2>
              <div className="gold-divider w-24 mx-auto mt-6" />
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredItems.map((item, i) => (
                <Reveal key={item.id} delay={i * 80}>
                  <FeaturedDishCard item={item} />
                </Reveal>
              ))}
            </div>

            <div className="text-center mt-14">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-champagne-dark hover:text-charcoal font-medium text-sm transition-colors group"
              >
                View Full Menu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Restaurant Experience - split image/text */}
      <section className="py-20 lg:py-28 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal>
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={EXPERIENCE_IMAGE}
                  alt="Restaurant ambience"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden lg:block w-32 h-32 border-2 border-champagne rounded-lg -z-10" />
            </Reveal>

            <Reveal delay={150}>
              <p className="text-champagne-dark text-sm uppercase tracking-[0.25em] mb-3 font-medium">
                Our Story
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-charcoal mb-6 text-balance">
                A Family Tradition
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Star Family Restaurant brings the authentic flavors of Telangana and Hyderabad
                to Hanamkonda. From our signature biryanis to our tandoori specialties, every dish
                is prepared with care and the freshest ingredients.
              </p>
              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <UtensilsCrossed className="w-5 h-5 text-champagne-dark" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-charcoal">Dine-In</h3>
                    <p className="text-sm text-muted-foreground">Comfortable seating for families and groups</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-champagne-dark" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-charcoal">Takeaway</h3>
                    <p className="text-sm text-muted-foreground">Order ahead and pick up at your convenience</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-champagne-dark" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-charcoal">Local</h3>
                    <p className="text-sm text-muted-foreground">Proudly serving the Hanamkonda community</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Tandoori showcase - full-width cinematic band */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={TANDOORI_IMAGE}
            alt="Tandoori grilling"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-deep-charcoal/75" />
        </div>
        <Reveal className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Flame className="w-10 h-10 text-champagne mx-auto mb-6" />
          <h2 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-6 text-balance">
            From the Tandoor
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-xl mx-auto">
            Sizzling tandoori favourites, grilled to perfection over open flames with traditional
            spices and marinades passed down through generations.
          </p>
          <Link
            href="/menu?category=tandoori"
            className="inline-flex items-center gap-2 bg-champagne hover:bg-champagne-dark text-white px-8 py-3.5 rounded-md font-medium transition-all duration-300 hover:shadow-xl hover:shadow-champagne/20"
          >
            Explore Tandoori
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>

      {/* CTA band */}
      <section className="py-20 lg:py-28 bg-charcoal">
        <Reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ChefHat className="w-10 h-10 text-champagne mx-auto mb-6" />
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-4 text-balance">
            Ready to Order?
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Browse our full menu and place your order for dine-in or takeaway.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-champagne hover:bg-champagne-dark text-white px-8 py-4 rounded-md font-medium transition-all duration-300 hover:shadow-xl hover:shadow-champagne/20 hover:-translate-y-0.5"
          >
            Start Your Order
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
