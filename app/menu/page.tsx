'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import type { Category, MenuItem } from '@/lib/types';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { MenuCard } from '@/components/menu/menu-card';
import { Search, SlidersHorizontal, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  useEffect(() => {
    async function loadData() {
      try {
        const [{ data: cats, error: catErr }, { data: menuItems, error: itemErr }] = await Promise.all([
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

        if (catErr) throw catErr;
        if (itemErr) throw itemErr;

        setCategories(cats || []);
        setItems(menuItems || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    let result = items;

    if (selectedCategory !== 'all') {
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) {
        result = result.filter(i => i.category_id === cat.id);
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.original_name.toLowerCase().includes(q) ||
        (i.description?.toLowerCase().includes(q) ?? false)
      );
    }

    const sorted = [...result];
    switch (sortBy) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      default:
        sorted.sort((a, b) => a.sort_order - b.sort_order);
    }

    return sorted;
  }, [items, categories, selectedCategory, search, sortBy]);

  const handleCategoryClick = useCallback((slug: string) => {
    setSelectedCategory(slug);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-champagne border-t-transparent animate-spin" />
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="text-destructive font-medium mb-2">Failed to load menu</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="bg-deep-charcoal py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-2">
            Our Menu
          </h1>
          <p className="text-white/60 text-sm lg:text-base">
            {items.length} dishes across {categories.length} categories
          </p>
        </div>
      </div>

      <div className="sticky top-16 lg:top-20 z-40 bg-warm-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-champagne/30"
              >
                <option value="default">Sort: Default</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            <button
              onClick={() => handleCategoryClick('all')}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors',
                selectedCategory === 'all'
                  ? 'bg-charcoal text-white'
                  : 'bg-ivory text-charcoal/70 hover:bg-accent'
              )}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors',
                  selectedCategory === cat.slug
                    ? 'bg-charcoal text-white'
                    : 'bg-ivory text-charcoal/70 hover:bg-accent'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-warm-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <UtensilsCrossed className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No dishes found matching your search.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                {filteredItems.map(item => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
