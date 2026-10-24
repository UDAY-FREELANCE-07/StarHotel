'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { useCart } from '@/components/cart/cart-context';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { formatPrice } from '@/lib/pricing';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle2, Utensils, ShoppingBag } from 'lucide-react';
import type { OrderType } from '@/lib/types';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [tableReference, setTableReference] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const orderItems = items.map(item => ({
        menu_item_id: item.menuItemId,
        item_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        line_total: Math.round(item.price * item.quantity * 100) / 100,
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          order_type: orderType,
          table_reference: tableReference || null,
          notes: notes || null,
          items: orderItems,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      router.push(`/order/${data.accessToken}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <h1 className="font-serif text-xl font-semibold text-charcoal mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              Add items to your cart before checking out.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-champagne hover:bg-champagne-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="bg-deep-charcoal py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-white">
            Checkout
          </h1>
        </div>
      </div>

      <div className="flex-1 bg-warm-white py-8 lg:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              <div className="bg-white border border-border rounded-md p-6">
                <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">
                  Your Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Phone <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-border rounded-md p-6">
                <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">
                  Order Type
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderType('DINE_IN')}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-md transition-colors ${
                      orderType === 'DINE_IN'
                        ? 'border-champagne bg-accent text-charcoal'
                        : 'border-border bg-white text-muted-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Utensils className="w-6 h-6" />
                    <span className="text-sm font-medium">Dine-In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('TAKEAWAY')}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-md transition-colors ${
                      orderType === 'TAKEAWAY'
                        ? 'border-champagne bg-accent text-charcoal'
                        : 'border-border bg-white text-muted-foreground hover:bg-accent/50'
                    }`}
                  >
                    <ShoppingBag className="w-6 h-6" />
                    <span className="text-sm font-medium">Takeaway</span>
                  </button>
                </div>

                {orderType === 'DINE_IN' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Table Number (optional)
                    </label>
                    <input
                      type="text"
                      value={tableReference}
                      onChange={e => setTableReference(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne"
                      placeholder="e.g. Table 5"
                    />
                  </div>
                )}
              </div>

              <div className="bg-white border border-border rounded-md p-6">
                <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">
                  Notes (optional)
                </h2>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne resize-none"
                  placeholder="Special instructions for the kitchen..."
                />
              </div>
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="bg-ivory border border-border rounded-md p-6">
                <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.menuItemId} className="flex items-center justify-between text-sm">
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-charcoal">{item.name}</span>
                        <span className="text-muted-foreground"> × {item.quantity}</span>
                      </div>
                      <span className="font-medium text-charcoal ml-2 shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="gold-divider my-4" />

                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-charcoal">Estimated Total</span>
                  <span className="font-serif text-2xl font-bold text-champagne-dark">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  Payment is collected at the restaurant (cash or UPI).
                  Prices will be verified by our staff before confirmation.
                </p>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 mb-4">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-champagne hover:bg-champagne-dark disabled:opacity-50 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Place Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
