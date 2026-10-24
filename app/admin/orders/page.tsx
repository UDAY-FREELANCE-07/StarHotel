'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { formatPrice } from '@/lib/pricing';
import { ORDER_STATUS_LABELS } from '@/lib/types';
import type { Order } from '@/lib/types';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_FILTERS = ['ALL', 'PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'REJECTED', 'CANCELLED'] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<typeof STATUS_FILTERS[number]>('ALL');

  useEffect(() => {
    async function loadOrders() {
      let query = supabaseBrowser
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter !== 'ALL') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (!error) {
        setOrders((data || []) as Order[]);
      }
      setLoading(false);
    }
    loadOrders();
  }, [filter]);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Orders</h1>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {STATUS_FILTERS.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors',
              filter === s
                ? 'bg-charcoal text-white'
                : 'bg-white text-charcoal/60 border border-border hover:bg-accent'
            )}
          >
            {s === 'ALL' ? 'All Orders' : ORDER_STATUS_LABELS[s as keyof typeof ORDER_STATUS_LABELS]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-champagne border-t-transparent animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-border rounded-md p-12 text-center">
          <ShoppingBag className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-md divide-y divide-border">
          {orders.map(order => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-champagne-dark">
                    {order.order_number.slice(-3)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{order.customer_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.order_number} • {order.order_type === 'DINE_IN' ? 'Dine-In' : 'Takeaway'}
                    {order.table_reference ? ` • ${order.table_reference}` : ''}
                    {' • '} {new Date(order.created_at).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-sm font-medium text-charcoal">{formatPrice(order.total)}</span>
                <span className={cn(
                  'text-xs font-medium px-2.5 py-1 rounded-full',
                  order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                  order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'PREPARING' ? 'bg-purple-100 text-purple-700' :
                  order.status === 'READY' ? 'bg-green-100 text-green-700' :
                  order.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' :
                  'bg-red-100 text-red-700'
                )}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
