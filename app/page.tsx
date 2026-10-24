import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { supabaseBrowser } from '@/lib/supabase-browser';
import type { Category, MenuItem } from '@/lib/types';
import Link from 'next/link';
import { ArrowRight, UtensilsCrossed, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/pricing';

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

  const availableCount = (items || []).filter(i => i.is_available).length;
  const pricedCount = (items || []).filter(i => i.price !== null).length;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] lg:h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/28674660/pexels-photo-28674660.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920)`,
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-3xl animate-fade-in-up">
            <p className="text-champagne text-sm uppercase tracking-[0.3em] mb-4 font-medium">
              Hanamkonda, Telangana
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Star Family Restaurant
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Authentic Indian cuisine — biryani, curries, tandoori, and more.
              Dine-in and takeaway, made fresh to order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 bg-champagne hover:bg-champagne-dark text-white px-8 py-3 rounded-md font-medium transition-colors"
              >
                Explore Menu
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white px-8 py-3 rounded-md font-medium transition-colors backdrop-blur-sm"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Status Notice */}
      {availableCount === 0 && (
        <div className="bg-accent/50 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-champagne-dark shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-charcoal">
                  Menu prices are pending owner verification
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  All {pricedCount} priced items will become available for ordering once the restaurant owner approves them.
                  Currently {availableCount} items are enabled for online ordering.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <section className="py-16 lg:py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-champagne-dark text-sm uppercase tracking-[0.2em] mb-2 font-medium">
              Our Menu
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-charcoal">
              Explore by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
            {(categories || []).map(cat => {
              const count = (items || []).filter(i => i.category_id === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  href={`/menu?category=${cat.slug}`}
                  className="group bg-ivory hover:bg-accent border border-border rounded-md p-4 text-center transition-colors"
                >
                  <UtensilsCrossed className="w-6 h-6 text-champagne-dark mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-charcoal leading-tight">{cat.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{count} items</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <section className="py-16 lg:py-20 bg-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-champagne-dark text-sm uppercase tracking-[0.2em] mb-2 font-medium">
                Chef's Selection
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-charcoal">
                Featured Dishes
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map(item => (
                <div
                  key={item.id}
                  className="bg-warm-white border border-border rounded-md overflow-hidden menu-card-shadow transition-shadow"
                >
                  <div className="aspect-[4/3] bg-accent overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UtensilsCrossed className="w-12 h-12 text-champagne-dark/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-champagne-dark uppercase tracking-wider mb-1">
                      {item.category?.name}
                    </p>
                    <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xl font-bold text-champagne-dark">
                        {formatPrice(item.price)}
                      </span>
                      <Link
                        href="/menu"
                        className="text-sm text-champagne-dark hover:text-charcoal font-medium"
                      >
                        Order &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About section */}
      <section className="py-16 lg:py-20 bg-warm-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-champagne-dark text-sm uppercase tracking-[0.2em] mb-2 font-medium">
            Our Story
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-charcoal mb-6">
            A Family Tradition
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Star Family Restaurant brings the authentic flavors of Telangana and Hyderabad
            to Hanamkonda. From our signature biryanis to our tandoori specialties,
            every dish is prepared with care and the freshest ingredients.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-champagne-dark" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-charcoal">Dine-In</h3>
              <p className="text-sm text-muted-foreground">Comfortable seating for families and groups</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-champagne-dark" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-charcoal">Takeaway</h3>
              <p className="text-sm text-muted-foreground">Order ahead and pick up at your convenience</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <MapPin className="w-6 h-6 text-champagne-dark" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-charcoal">Local</h3>
              <p className="text-sm text-muted-foreground">Proudly serving the Hanamkonda community</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
