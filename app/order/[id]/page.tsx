'use client';

import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { formatPrice } from '@/lib/pricing';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/types';
import type { Order, OrderItem, Payment } from '@/lib/types';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, Utensils, ShoppingBag, Loader2, AlertCircle, Receipt } from 'lucide-react';

export default function OrderPage() {
  const params = useParams();
  const accessToken = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const [{ data: orderData, error: orderErr }, { data: itemsData, error: itemsErr }, { data: payData, error: payErr }] = await Promise.all([
          supabaseBrowser.rpc('get_order_by_access_token', { p_token: accessToken }),
          supabaseBrowser.rpc('get_order_items_by_access_token', { p_token: accessToken }),
          supabaseBrowser.rpc('get_order_payments_by_access_token', { p_token: accessToken }),
        ]);

        if (orderErr) throw orderErr;
        if (itemsErr) throw itemsErr;
        if (payErr) throw payErr;

        if (!orderData || orderData.length === 0) {
          setError('Order not found');
          return;
        }

        setOrder(orderData[0] as Order);
        setOrderItems((itemsData || []) as OrderItem[]);
        setPayments((payData || []) as Payment[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-champagne-dark animate-spin" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="font-serif text-xl font-semibold text-charcoal mb-2">
              {error || 'Order not found'}
            </h1>
            <Link href="/menu" className="text-champagne-dark hover:text-charcoal text-sm font-medium">
              Back to Menu
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const paidAmount = payments
    .filter(p => p.status === 'CONFIRMED')
    .reduce((sum, p) => sum + p.amount, 0);
  const remaining = order.total - paidAmount;

  const statusSteps = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="bg-deep-charcoal py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-champagne mx-auto mb-4" />
          <h1 className="font-serif text-3xl font-bold text-white mb-2">
            Order Confirmed
          </h1>
          <p className="text-white/60 text-sm">
            Order #{order.order_number}
          </p>
        </div>
      </div>

      <div className="flex-1 bg-warm-white py-8 lg:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Status */}
          <div className="bg-white border border-border rounded-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-lg font-semibold text-charcoal">Order Status</h2>
              <span className="text-xs text-muted-foreground">
                {new Date(order.created_at).toLocaleString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>

            {order.status === 'REJECTED' || order.status === 'CANCELLED' ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 text-center">
                <p className="font-medium text-destructive">
                  This order has been {order.status.toLowerCase()}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                {statusSteps.slice(0, 4).map((step, idx) => {
                  const stepIndex = statusSteps.indexOf(step);
                  const isComplete = currentStepIndex > stepIndex;
                  const isCurrent = currentStepIndex === stepIndex;
                  const isFinal = order.status === 'COMPLETED';

                  return (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isComplete || isFinal
                              ? 'bg-champagne text-white'
                              : isCurrent
                              ? 'bg-charcoal text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {isComplete || isFinal ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${
                          isComplete || isCurrent || isFinal ? 'text-charcoal' : 'text-muted-foreground'
                        }`}>
                          {ORDER_STATUS_LABELS[step as keyof typeof ORDER_STATUS_LABELS]}
                        </span>
                      </div>
                      {idx < 3 && (
                        <div className={`flex-1 h-0.5 mx-2 ${
                          isComplete || (isCurrent && idx < currentStepIndex) ? 'bg-champagne' : 'bg-border'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white border border-border rounded-md p-6">
            <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">Items</h2>
            <div className="space-y-3">
              {orderItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                  <div className="flex-1">
                    <span className="font-medium text-charcoal">{item.item_name}</span>
                    <span className="text-muted-foreground"> × {item.quantity}</span>
                  </div>
                  <span className="font-medium text-charcoal">
                    {formatPrice(item.line_total)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-semibold text-charcoal">Total</span>
                <span className="font-serif text-xl font-bold text-champagne-dark">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-border rounded-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5 text-champagne-dark" />
              <h2 className="font-serif text-lg font-semibold text-charcoal">Payment</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-charcoal">{PAYMENT_STATUS_LABELS[order.payment_status]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium text-charcoal">{formatPrice(order.total)}</span>
              </div>
              {paidAmount > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-medium text-charcoal">{formatPrice(paidAmount)}</span>
                  </div>
                  {remaining > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-medium text-destructive">{formatPrice(remaining)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="mt-4 bg-accent/50 rounded-md p-3">
              <p className="text-xs text-muted-foreground">
                Payment is collected at the restaurant. Please pay at the counter using cash or UPI.
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white border border-border rounded-md p-6">
            <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium text-charcoal flex items-center gap-1.5">
                  {order.order_type === 'DINE_IN' ? <Utensils className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  {order.order_type === 'DINE_IN' ? 'Dine-In' : 'Takeaway'}
                </span>
              </div>
              {order.table_reference && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Table</span>
                  <span className="font-medium text-charcoal">{order.table_reference}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium text-charcoal">{order.customer_name}</span>
              </div>
              {order.notes && (
                <div className="pt-2 border-t border-border mt-2">
                  <span className="text-muted-foreground text-xs">Notes</span>
                  <p className="text-charcoal mt-1">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-champagne-dark hover:text-charcoal font-medium text-sm"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
