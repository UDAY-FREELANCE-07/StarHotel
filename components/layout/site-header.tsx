'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { useCart } from '@/components/cart/cart-context';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-deep-charcoal/95 backdrop-blur-md border-b border-champagne/15 shadow-lg'
          : 'bg-warm-white/95 backdrop-blur-sm border-b border-border'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                scrolled ? 'bg-champagne/15 ring-1 ring-champagne/30' : 'bg-accent'
              )}
            >
              <UtensilsCrossed className="w-5 h-5 text-champagne-dark" />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className={cn(
                  'font-serif text-lg lg:text-xl font-bold tracking-tight transition-colors',
                  scrolled ? 'text-white' : 'text-charcoal'
                )}
              >
                Star Family
              </span>
              <span className="text-[10px] lg:text-xs uppercase tracking-[0.2em] text-champagne-dark">
                Restaurant
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-sm font-medium transition-colors hover:text-champagne-dark after:content-[""] after:absolute after:bottom-[-6px] after:left-0 after:h-px after:bg-champagne after:transition-all after:duration-300',
                  pathname === link.href
                    ? scrolled ? 'text-champagne after:w-full' : 'text-champagne-dark after:w-full'
                    : scrolled ? 'text-white/70 after:w-0 hover:after:w-full' : 'text-charcoal/70 after:w-0 hover:after:w-full'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className={cn(
                'relative flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
                scrolled ? 'hover:bg-champagne/15' : 'hover:bg-accent'
              )}
              aria-label="Cart"
            >
              <ShoppingBag className={cn('w-5 h-5', scrolled ? 'text-white' : 'text-charcoal')} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-champagne text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-fade-in">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className={cn('md:hidden p-2', scrolled ? 'text-white' : 'text-charcoal')}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-champagne/10 animate-fade-in">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block py-3 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-champagne-dark'
                    : 'text-charcoal/70 hover:text-champagne-dark'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
