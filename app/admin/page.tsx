'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { formatPrice } from '@/lib/pricing';
import { ORDER_STATUS_LABELS } from '@/lib/types';
import type { Order } from '@/lib/types';
import Link from 'next/link';
import { ShoppingBag, Clock, CheckCircle2, IndianRupee, TrendingUp, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
    todayRevenue: 0,
    todayOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const [
        { count: pending },
        { count: preparing },
        { count: ready },
        { count: completed },
        { count: todayOrders },
        { data: todayOrderData },
        { data: recent },
      ] = await Promise.all([
        supabaseBrowser.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
        supabaseBrowser.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'PREPARING'),
        supabaseBrowser.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'READY'),
        supabaseBrowser.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'COMPLETED'),
        supabaseBrowser.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
        supabaseBrowser.from('orders').select('total, payment_status').gte('created_at', todayISO).eq('payment_status', 'PAID'),
        supabaseBrowser.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      const todayRevenue = (todayOrderData || []).reduce((sum, o) => sum + parseFloat(String(o.total)), 0);

      setStats({
        pending: pending || 0,
        preparing: preparing || 0,
        ready: ready || 0,
        completed: completed || 0,
        todayRevenue,
        todayOrders: todayOrders || 0,
      });
      setRecentOrders((recent || []) as Order[]);
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-champagne border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-border rounded-md p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-champagne-dark" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Pending</span>
          </div>
          <p className="font-serif text-2xl font-bold text-charcoal">{stats.pending}</p>
        </div>
        <div className="bg-white border border-border rounded-md p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-champagne-dark" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Preparing</span>
          </div>
          <p className="font-serif text-2xl font-bold text-charcoal">{stats.preparing}</p>
        </div>
        <div className="bg-white border border-border rounded-md p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-champagne-dark" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Ready</span>
          </div>
          <p className="font-serif text-2xl font-bold text-charcoal">{stats.ready}</p>
        </div>
        <div className="bg-white border border-border rounded-md p-5">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="w-4 h-4 text-champagne-dark" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Today's Revenue</span>
          </div>
          <p className="font-serif text-2xl font-bold text-charcoal">{formatPrice(stats.todayRevenue)}</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-md">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-serif text-lg font-semibold text-charcoal">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-champagne-dark hover:text-charcoal flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map(order => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-xs font-bold text-champagne-dark">
                      {order.order_number.slice(-3)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.order_number} • {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-charcoal">{formatPrice(order.total)}</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'PREPARING' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'READY' ? 'bg-green-100 text-green-700' :
                    order.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
