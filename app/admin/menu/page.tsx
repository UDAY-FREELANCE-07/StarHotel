'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { formatPrice } from '@/lib/pricing';
import type { Category, MenuItem } from '@/lib/types';
import { Search, Save, X, AlertCircle, Check, Loader2, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'unavailable' | 'unpriced'>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editAvailable, setEditAvailable] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [{ data: cats }, { data: menuItems }] = await Promise.all([
      supabaseBrowser.from('categories').select('*').eq('is_active', true).order('sort_order'),
      supabaseBrowser.from('menu_items').select('*, category:categories(*)').order('sort_order'),
    ]);
    setCategories(cats || []);
    setItems(menuItems || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const startEdit = (item: MenuItem) => {
    setEditingItem(item);
    setEditPrice(item.price !== null ? item.price.toFixed(2) : '');
    setEditAvailable(item.is_available);
    setEditName(item.name);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditPrice('');
    setEditName('');
    setEditAvailable(false);
  };

  const saveEdit = async () => {
    if (!editingItem) return;
    setSaving(true);
    setSaveMsg(null);

    const { data: session } = await supabaseBrowser.auth.getSession();
    const userId = session.session?.user.id;

    const updates: Record<string, unknown> = {
      is_available: editAvailable,
    };

    if (editName !== editingItem.name) {
      updates.name = editName;
    }

    const newPrice = editPrice.trim() === '' ? null : parseFloat(editPrice);
    const oldPrice = editingItem.price;

    if (newPrice !== oldPrice) {
      updates.price = newPrice;
      if (newPrice !== null) {
        updates.price_verified_at = new Date().toISOString();
      } else {
        updates.price_verified_at = null;
        updates.is_available = false;
      }

      await supabaseBrowser.from('menu_price_history').insert({
        menu_item_id: editingItem.id,
        previous_price: oldPrice,
        new_price: newPrice,
        changed_by: userId,
        reason: 'Admin price update',
      });
    }

    const { error } = await supabaseBrowser
      .from('menu_items')
      .update(updates)
      .eq('id', editingItem.id);

    if (!error) {
      setSaveMsg('Saved successfully');
      setTimeout(() => setSaveMsg(null), 3000);
      await loadData();
      cancelEdit();
    } else {
      setSaveMsg('Failed to save: ' + error.message);
    }
    setSaving(false);
  };

  const filteredItems = items.filter(item => {
    if (filterCat !== 'all') {
      const cat = categories.find(c => c.slug === filterCat);
      if (!cat || item.category_id !== cat.id) return false;
    }
    if (filterStatus === 'available' && !item.is_available) return false;
    if (filterStatus === 'unavailable' && item.is_available) return false;
    if (filterStatus === 'unpriced' && item.price !== null) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      if (!item.name.toLowerCase().includes(q) && !item.original_name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-champagne-dark animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-charcoal">Menu Management</h1>
        {saveMsg && (
          <div className={cn(
            'flex items-center gap-2 text-sm px-3 py-2 rounded-md',
            saveMsg.includes('Failed') ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-700'
          )}>
            {saveMsg.includes('Failed') ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {saveMsg}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-md bg-white"
          />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="text-sm border border-border rounded-md px-3 py-2 bg-white">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)} className="text-sm border border-border rounded-md px-3 py-2 bg-white">
          <option value="all">All Items</option>
          <option value="available">Available Only</option>
          <option value="unavailable">Unavailable Only</option>
          <option value="unpriced">Unpriced Only</option>
        </select>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{filteredItems.length} items</p>

      <div className="bg-white border border-border rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-accent/30">
              <th className="text-left p-3 font-medium text-muted-foreground">Item</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Category</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Price</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Available</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredItems.map(item => (
              <tr key={item.id} className={cn('hover:bg-accent/20', editingItem?.id === item.id && 'bg-accent/40')}>
                {editingItem?.id === item.id ? (
                  <>
                    <td className="p-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-border rounded-md"
                      />
                      {item.description?.startsWith('Flagged') && (
                        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {item.description}
                        </p>
                      )}
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{item.category?.name}</td>
                    <td className="p-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        placeholder="No price"
                        className="w-24 px-2 py-1 text-sm border border-border rounded-md text-right"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setEditAvailable(!editAvailable)}
                        className={cn(
                          'w-12 h-6 rounded-full transition-colors',
                          editAvailable ? 'bg-green-500' : 'bg-gray-300'
                        )}
                      >
                        <span className={cn('block w-5 h-5 bg-white rounded-full transition-transform', editAvailable && 'translate-x-6')} />
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={saveEdit} disabled={saving} className="p-1.5 bg-champagne text-white rounded-md hover:bg-champagne-dark">
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={cancelEdit} className="p-1.5 border border-border rounded-md hover:bg-accent">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">
                      <p className="font-medium text-charcoal">{item.name}</p>
                      {item.name !== item.original_name && (
                        <p className="text-xs text-muted-foreground italic">Original: {item.original_name}</p>
                      )}
                      {item.description?.startsWith('Flagged') && (
                        <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" /> Review needed
                        </p>
                      )}
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{item.category?.name}</td>
                    <td className="p-3 text-right">
                      {item.price !== null ? (
                        <span className="font-medium text-charcoal">{formatPrice(item.price)}</span>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">Not set</span>
                      )}
                      {item.price_verified_at && (
                        <span className="block text-[10px] text-green-600">verified</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className={cn(
                        'inline-block w-2 h-2 rounded-full',
                        item.is_available ? 'bg-green-500' : 'bg-gray-300'
                      )} />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-sm text-champagne-dark hover:text-charcoal font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
