'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { Loader2, UtensilsCrossed, LayoutDashboard, ShoppingBag, BookOpen, LogOut, Utensils } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState<string>('');

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.push('/admin/login');
        return;
      }

      const { data: adminData } = await supabaseBrowser
        .from('admin_users')
        .select('name, role')
        .eq('user_id', data.session.user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!adminData) {
        await supabaseBrowser.auth.signOut();
        router.push('/admin/login');
        return;
      }

      setAdminName(adminData.name);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal">
        <Loader2 className="w-8 h-8 text-champagne animate-spin" />
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/menu', label: 'Menu', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-ivory flex">
      <aside className="w-60 bg-charcoal min-h-screen flex flex-col fixed lg:sticky top-0 z-30">
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-champagne" />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-base font-bold text-white">Star Family</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-champagne">Admin</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-champagne text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Utensils className="w-4 h-4" />
            View Site
          </Link>
          <button
            onClick={async () => {
              await supabaseBrowser.auth.signOut();
              router.push('/admin/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <div className="px-3 py-2 text-xs text-white/30">
            Signed in as {adminName}
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
