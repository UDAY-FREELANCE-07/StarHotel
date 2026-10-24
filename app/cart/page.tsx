'use client';

import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { useCart } from '@/components/cart/cart-context';
import { formatPrice } from '@/lib/pricing';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalItems, clearCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="bg-deep-charcoal py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-white">
            Your Cart
          </h1>
          {totalItems > 0 && (
            <p className="text-white/60 text-sm mt-2">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 bg-warm-white py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
              <h2 className="font-serif text-xl font-semibold text-charcoal mb-2">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Browse our menu and add dishes to get started.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-champagne hover:bg-champagne-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Browse Menu
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map(item => (
                  <div
                    key={item.menuItemId}
                    className="flex items-center gap-4 bg-white border border-border rounded-md p-4"
                  >
                    <div className="w-16 h-16 bg-accent rounded-md overflow-hidden shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-serif text-champagne-dark/30">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base font-semibold text-charcoal truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-border hover:bg-accent transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-medium text-charcoal">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-border hover:bg-accent transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-serif text-lg font-bold text-champagne-dark">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-ivory border border-border rounded-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-serif text-2xl font-bold text-charcoal">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  Final pricing will be verified at checkout. Total may change if prices have been updated.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/checkout"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-champagne hover:bg-champagne-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={clearCart}
                    className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-destructive border border-border rounded-md transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
