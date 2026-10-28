'use client';

import type { MenuItem } from '@/lib/types';
import { formatPrice } from '@/lib/pricing';
import { useCart } from '@/components/cart/cart-context';
import { useState } from 'react';
import { Plus, CheckCircle2, UtensilsCrossed } from 'lucide-react';

export function FeaturedDishCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const canOrder = item.is_available && item.price !== null;

  const handleAdd = () => {
    if (!canOrder || item.price === null) return;
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden menu-card-shadow transition-all duration-300 group hover:-translate-y-1">
      <div className="aspect-[4/3] bg-accent overflow-hidden relative">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="w-12 h-12 text-champagne-dark/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-champagne-dark mb-1.5 font-medium">
          {item.category?.name}
        </p>
        <h3 className="font-serif text-lg font-semibold text-charcoal mb-2 leading-tight">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <span className="font-serif text-xl font-bold text-champagne-dark">
            {canOrder ? formatPrice(item.price) : 'In-store only'}
          </span>

          {canOrder ? (
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 bg-charcoal hover:bg-deep-charcoal text-white text-xs font-medium px-4 py-2.5 rounded-md transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              {added ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
