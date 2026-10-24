'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { formatPrice } from '@/lib/pricing';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, canTransitionTo, ORDER_STATUS_FLOW } from '@/lib/types';
import type { Order, OrderItem, Payment, OrderStatus } from '@/lib/types';
import { ArrowLeft, Loader2, CheckCircle2, Receipt, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: [],
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'CASH' | 'UPI'>('CASH');
  const [payRef, setPayRef] = useState('');

  useEffect(() => {
    async function loadData() {
      const [{ data: orderData }, { data: itemsData }, { data: payData }] = await Promise.all([
        supabaseBrowser.from('orders').select('*').eq('id', orderId).maybeSingle(),
        supabaseBrowser.from('order_items').select('*').eq('order_id', orderId),
        supabaseBrowser.from('payments').select('*').eq('order_id', orderId).order('created_at', { ascending: false }),
      ]);

      if (!orderData) {
        setLoading(false);
        return;
      }

      setOrder(orderData as Order);
      setItems((itemsData || []) as OrderItem[]);
      setPayments((payData || []) as Payment[]);
      setLoading(false);
    }
    loadData();
  }, [orderId]);

  const updateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    if (!canTransitionTo(order.status, newStatus)) return;
    setUpdating(true);

    const { data: session } = await supabaseBrowser.auth.getSession();
    const userId = session.session?.user.id;

    await supabaseBrowser.from('order_status_history').insert({
      order_id: order.id,
      from_status: order.status,
      to_status: newStatus,
      changed_by: userId,
    });

    const { data } = await supabaseBrowser
      .from('orders')
      .update({ status: newStatus })
      .eq('id', order.id)
      .select()
      .maybeSingle();

    if (data) setOrder(data as Order);
    setUpdating(false);
  };

  const recordPayment = async () => {
    if (!order) return;
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0) return;

    const paidSoFar = payments.filter(p => p.status === 'CONFIRMED').reduce((s, p) => s + p.amount, 0);
    const remaining = order.total - paidSoFar;

    if (amount > remaining + 0.01) {
      alert('Amount exceeds remaining balance');
      return;
    }

    setUpdating(true);
    const { data: session } = await supabaseBrowser.auth.getSession();

    const { data: newPay } = await supabaseBrowser
      .from('payments')
      .insert({
        order_id: order.id,
        method: payMethod,
        amount,
        status: 'CONFIRMED',
        reference: payRef || null,
        recorded_by: session.session?.user.id,
      })
      .select()
      .maybeSingle();

    if (newPay) {
      const newPaid = paidSoFar + amount;
      const newPaymentStatus = newPaid >= order.total - 0.01 ? 'PAID' : 'PARTIALLY_PAID';

      await supabaseBrowser.from('orders').update({ payment_status: newPaymentStatus }).eq('id', order.id);

      setPayments(prev => [newPay as Payment, ...prev]);
      setOrder({ ...order, payment_status: newPaymentStatus });
      setShowPayment(false);
      setPayAmount('');
      setPayRef('');
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-champagne-dark animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Order not found</p>
        <Link href="/admin/orders" className="text-champagne-dark text-sm mt-2 inline-block">Back to orders</Link>
      </div>
    );
  }

  const paidAmount = payments.filter(p => p.status === 'CONFIRMED').reduce((s, p) => s + p.amount, 0);
  const remaining = order.total - paidAmount;
  const possibleNext = NEXT_STATUSES[order.status];

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-charcoal mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="bg-white border border-border rounded-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-serif text-xl font-bold text-charcoal">{order.order_number}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(order.created_at).toLocaleString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
          <div className="text-right">
            <span className={cn(
              'inline-block text-xs font-medium px-3 py-1.5 rounded-full mb-2',
              order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
              order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
              order.status === 'PREPARING' ? 'bg-purple-100 text-purple-700' :
              order.status === 'READY' ? 'bg-green-100 text-green-700' :
              order.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' :
              'bg-red-100 text-red-700'
            )}>
              {ORDER_STATUS_LABELS[order.status]}
            </span>
            <p className="text-xs text-muted-foreground">{PAYMENT_STATUS_LABELS[order.payment_status]}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Customer</p>
            <p className="font-medium text-charcoal">{order.customer_name}</p>
            <p className="text-muted-foreground">{order.customer_phone}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Type</p>
            <p className="font-medium text-charcoal">
              {order.order_type === 'DINE_IN' ? 'Dine-In' : 'Takeaway'}
              {order.table_reference ? ` — ${order.table_reference}` : ''}
            </p>
          </div>
          {order.notes && (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
              <p className="text-charcoal">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-border rounded-md p-6 mb-6">
        <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">Items</h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
              <div className="flex-1">
                <span className="font-medium text-charcoal">{item.item_name}</span>
                <span className="text-muted-foreground"> × {item.quantity}</span>
                <span className="text-muted-foreground ml-2">@ {formatPrice(item.unit_price)}</span>
              </div>
              <span className="font-medium text-charcoal">{formatPrice(item.line_total)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border flex justify-between">
          <span className="font-serif text-lg font-semibold text-charcoal">Total</span>
          <span className="font-serif text-xl font-bold text-champagne-dark">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="bg-white border border-border rounded-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-5 h-5 text-champagne-dark" />
          <h2 className="font-serif text-lg font-semibold text-charcoal">Payment</h2>
        </div>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-medium">{formatPrice(order.total)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="font-medium text-green-600">{formatPrice(paidAmount)}</span></div>
          {remaining > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Remaining</span><span className="font-medium text-destructive">{formatPrice(remaining)}</span></div>}
        </div>

        {payments.length > 0 && (
          <div className="space-y-2 mb-4">
            {payments.map(p => (
              <div key={p.id} className="flex items-center justify-between text-xs bg-accent/50 rounded-md px-3 py-2">
                <span className="font-medium">{p.method} — {formatPrice(p.amount)}</span>
                <span className={p.status === 'CONFIRMED' ? 'text-green-600' : 'text-red-600'}>{p.status}</span>
              </div>
            ))}
          </div>
        )}

        {remaining > 0 && order.status !== 'CANCELLED' && order.status !== 'REJECTED' && (
          <>
            {!showPayment ? (
              <button
                onClick={() => { setShowPayment(true); setPayAmount(remaining.toFixed(2)); }}
                className="w-full bg-charcoal hover:bg-deep-charcoal text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors"
              >
                Record Payment
              </button>
            ) : (
              <div className="space-y-3 bg-accent/30 rounded-md p-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={payAmount}
                    onChange={e => setPayAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Method</label>
                  <div className="flex gap-2">
                    <button onClick={() => setPayMethod('CASH')} className={cn('flex-1 py-2 text-sm rounded-md border', payMethod === 'CASH' ? 'border-champagne bg-accent' : 'border-border bg-white')}>Cash</button>
                    <button onClick={() => setPayMethod('UPI')} className={cn('flex-1 py-2 text-sm rounded-md border', payMethod === 'UPI' ? 'border-champagne bg-accent' : 'border-border bg-white')}>UPI</button>
                  </div>
                </div>
                {payMethod === 'UPI' && (
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">UPI Reference (optional)</label>
                    <input
                      type="text"
                      value={payRef}
                      onChange={e => setPayRef(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-white"
                      placeholder="Transaction ID"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={recordPayment}
                    disabled={updating}
                    className="flex-1 bg-champagne hover:bg-champagne-dark text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                  >
                    {updating ? 'Recording...' : 'Confirm Payment'}
                  </button>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="px-4 py-2 text-sm border border-border rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {possibleNext.length > 0 && (
        <div className="bg-white border border-border rounded-md p-6">
          <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">Update Status</h2>
          <div className="flex flex-wrap gap-2">
            {possibleNext.map(status => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                disabled={updating}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  status === 'REJECTED' || status === 'CANCELLED'
                    ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                    : 'bg-charcoal text-white hover:bg-deep-charcoal'
                )}
              >
                {updating ? 'Updating...' : `Mark as ${ORDER_STATUS_LABELS[status]}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
