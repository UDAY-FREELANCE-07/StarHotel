export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '—';
  return `₹${price.toFixed(2)}`;
}

export function formatPricePlain(price: number | null | undefined): string {
  if (price === null || price === undefined) return '0.00';
  return price.toFixed(2);
}

export function calculateLineTotal(unitPrice: number, quantity: number): number {
  return Math.round(unitPrice * quantity * 100) / 100;
}

export function calculateSubtotal(items: { unit_price: number; quantity: number }[]): number {
  const total = items.reduce((sum, item) => {
    return sum + calculateLineTotal(item.unit_price, item.quantity);
  }, 0);
  return Math.round(total * 100) / 100;
}

export function calculateCartTotal(items: { price: number; quantity: number }[]): number {
  const total = items.reduce((sum, item) => {
    return sum + calculateLineTotal(item.price, item.quantity);
  }, 0);
  return Math.round(total * 100) / 100;
}
