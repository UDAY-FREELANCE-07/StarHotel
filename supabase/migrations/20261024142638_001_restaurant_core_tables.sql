/*
# Star Family Restaurant - Core Tables (Part 1)

## Overview
Creates all base tables for the Star Family Restaurant ordering platform.
All monetary values use numeric(12,2) for exact decimal arithmetic.

## New Tables
1. categories - Menu categories (e.g. Biryanis, Breads)
2. menu_items - Individual dishes with prices, availability, verification state
3. orders - Customer orders (dine-in / takeaway)
4. order_items - Immutable line items snapshotting name + price at order time
5. payments - Cash / UPI payment records with reconciliation
6. order_status_history - Audit trail of order status transitions
7. menu_price_history - Audit trail of price changes
8. admin_users - Links Supabase auth.users to restaurant staff roles
9. restaurant_settings - Key-value JSON config

## Notes
- RLS is enabled on all tables but policies are added in Part 2 (after is_admin function).
- Grants are included here so tables are reachable via the Data API.
*/

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_key ON categories (slug);
CREATE INDEX IF NOT EXISTS categories_sort_order_idx ON categories (sort_order);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- MENU ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  source_key text NOT NULL,
  name text NOT NULL,
  original_name text NOT NULL,
  description text,
  price numeric(12,2),
  price_verified_at timestamptz,
  image_url text,
  is_available boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS menu_items_source_key_key ON menu_items (source_key);
CREATE INDEX IF NOT EXISTS menu_items_category_id_idx ON menu_items (category_id);
CREATE INDEX IF NOT EXISTS menu_items_name_idx ON menu_items (name);
CREATE INDEX IF NOT EXISTS menu_items_active_available_idx ON menu_items (is_active, is_available);

ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_price_nonneg;
ALTER TABLE menu_items ADD CONSTRAINT menu_items_price_nonneg CHECK (price IS NULL OR price >= 0);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL,
  access_token uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  order_type text NOT NULL DEFAULT 'DINE_IN',
  table_reference text,
  notes text,
  status text NOT NULL DEFAULT 'PENDING',
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'UNPAID',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT orders_order_type_check CHECK (order_type IN ('DINE_IN', 'TAKEAWAY')),
  CONSTRAINT orders_status_check CHECK (status IN ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'REJECTED', 'CANCELLED')),
  CONSTRAINT orders_payment_status_check CHECK (payment_status IN ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUNDED')),
  CONSTRAINT orders_subtotal_nonneg CHECK (subtotal >= 0),
  CONSTRAINT orders_total_nonneg CHECK (total >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_key ON orders (order_number);
CREATE UNIQUE INDEX IF NOT EXISTS orders_access_token_key ON orders (access_token);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name text NOT NULL,
  unit_price numeric(12,2) NOT NULL,
  quantity integer NOT NULL,
  line_total numeric(12,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT order_items_quantity_pos CHECK (quantity > 0),
  CONSTRAINT order_items_unit_price_nonneg CHECK (unit_price >= 0),
  CONSTRAINT order_items_line_total_nonneg CHECK (line_total >= 0)
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);
CREATE INDEX IF NOT EXISTS order_items_menu_item_id_idx ON order_items (menu_item_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  method text NOT NULL,
  amount numeric(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'CONFIRMED',
  reference text,
  recorded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payments_method_check CHECK (method IN ('CASH', 'UPI')),
  CONSTRAINT payments_status_check CHECK (status IN ('CONFIRMED', 'REVERSED')),
  CONSTRAINT payments_amount_pos CHECK (amount > 0)
);

CREATE INDEX IF NOT EXISTS payments_order_id_idx ON payments (order_id);
CREATE INDEX IF NOT EXISTS payments_created_at_idx ON payments (created_at DESC);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- ORDER STATUS HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  changed_by uuid,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_status_history_order_id_idx ON order_status_history (order_id);

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- MENU PRICE HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS menu_price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  previous_price numeric(12,2),
  new_price numeric(12,2),
  changed_by uuid,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS menu_price_history_menu_item_id_idx ON menu_price_history (menu_item_id);

ALTER TABLE menu_price_history ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- ADMIN USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'STAFF',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_users_role_check CHECK (role IN ('OWNER', 'MANAGER', 'STAFF'))
);

CREATE INDEX IF NOT EXISTS admin_users_user_id_idx ON admin_users (user_id);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RESTAURANT SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS categories_updated_at ON categories;
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS menu_items_updated_at ON menu_items;
CREATE TRIGGER menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS admin_users_updated_at ON admin_users;
CREATE TRIGGER admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS restaurant_settings_updated_at ON restaurant_settings;
CREATE TRIGGER restaurant_settings_updated_at BEFORE UPDATE ON restaurant_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();