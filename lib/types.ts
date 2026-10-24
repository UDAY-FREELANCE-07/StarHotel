export type OrderType = 'DINE_IN' | 'TAKEAWAY';
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'UPI';
export type AdminRole = 'OWNER' | 'MANAGER' | 'STAFF';

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  source_key: string;
  name: string;
  original_name: string;
  description: string | null;
  price: number | null;
  price_verified_at: string | null;
  image_url: string | null;
  is_available: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface Order {
  id: string;
  order_number: string;
  access_token: string;
  customer_name: string;
  customer_phone: string;
  order_type: OrderType;
  table_reference: string | null;
  notes: string | null;
  status: OrderStatus;
  subtotal: number;
  total: number;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  payments?: Payment[];
}

export interface Payment {
  id: string;
  order_id: string;
  method: PaymentMethod;
  amount: number;
  status: 'CONFIRMED' | 'REVERSED';
  reference: string | null;
  recorded_by: string | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  from_status: OrderStatus | null;
  to_status: OrderStatus;
  changed_by: string | null;
  note: string | null;
  created_at: string;
}

export interface MenuPriceHistory {
  id: string;
  menu_item_id: string;
  previous_price: number | null;
  new_price: number | null;
  changed_by: string | null;
  reason: string | null;
  created_at: string;
}

export const ORDER_STATUS_FLOW: OrderStatus[] = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];

export function canTransitionTo(current: OrderStatus, next: OrderStatus): boolean {
  if (current === next) return false;
  if (current === 'PENDING') {
    return ['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(next);
  }
  if (current === 'ACCEPTED') {
    return ['PREPARING', 'CANCELLED'].includes(next);
  }
  if (current === 'PREPARING') {
    return ['READY', 'CANCELLED'].includes(next);
  }
  if (current === 'READY') {
    return ['COMPLETED', 'CANCELLED'].includes(next);
  }
  return false;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY: 'Ready',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  UNPAID: 'Unpaid',
  PARTIALLY_PAID: 'Partially Paid',
  PAID: 'Paid',
  REFUNDED: 'Refunded',
};
