'use client';

import { useCart } from '@/components/cart/cart-context';
import type { MenuItem } from '@/lib/types';
import { formatPrice } from '@/lib/pricing';
import { Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
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
    <div className="bg-warm-white border border-border rounded-md overflow-hidden menu-card-shadow transition-shadow group">
      <div className="aspect-[4/3] bg-accent overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl font-serif text-champagne-dark/20">
              {item.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-[10px] uppercase tracking-wider text-champagne-dark mb-1 font-medium">
          {item.category?.name}
        </p>
        <h3 className="font-serif text-base font-semibold text-charcoal leading-tight mb-1">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div>
            {item.price !== null ? (
              <span className="font-serif text-lg font-bold text-champagne-dark">
                {formatPrice(item.price)}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground italic">Price not set</span>
            )}
          </div>

          {canOrder ? (
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 bg-charcoal hover:bg-deep-charcoal text-white text-xs font-medium px-3 py-2 rounded-md transition-colors"
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
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md">
              <AlertCircle className="w-3.5 h-3.5" />
              {item.price === null ? 'No price' : 'Unavailable'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
