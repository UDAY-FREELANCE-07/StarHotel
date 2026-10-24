'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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

  return (
    <header className="sticky top-0 z-50 bg-warm-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <UtensilsCrossed className="w-6 h-6 text-champagne-dark" />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg lg:text-xl font-bold text-charcoal tracking-tight">
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
                  'text-sm font-medium transition-colors hover:text-champagne-dark',
                  pathname === link.href
                    ? 'text-champagne-dark'
                    : 'text-charcoal/70'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-charcoal" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-champagne text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block py-3 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-champagne-dark'
                    : 'text-charcoal/70'
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
