/*
# Star Family Restaurant - Helper Functions, Policies & Grants (Part 2)

## Overview
Creates the is_admin() helper function, all RLS policies, grants, and
SECURITY DEFINER functions for customer order access.

## Security Model
- Menu categories and items: PUBLIC read (anon + authenticated). Admin write only.
- Orders: PUBLIC insert. Admin SELECT/UPDATE. Customer access via SECURITY DEFINER functions.
- Payments, history tables, admin_users, settings: admin-only.
- Admin authorization enforced via is_admin() which checks the admin_users table.
*/

-- ============================================================
-- HELPER FUNCTION: is_admin()
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  );
$$;

REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- ============================================================
-- CATEGORIES: GRANTS & POLICIES
-- ============================================================
GRANT SELECT ON categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON categories TO authenticated;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories" ON categories FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories" ON categories FOR DELETE
  TO authenticated USING (is_admin());

-- ============================================================
-- MENU ITEMS: GRANTS & POLICIES
-- ============================================================
GRANT SELECT ON menu_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON menu_items TO authenticated;

DROP POLICY IF EXISTS "public_read_menu_items" ON menu_items;
CREATE POLICY "public_read_menu_items" ON menu_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_menu_items" ON menu_items;
CREATE POLICY "admin_insert_menu_items" ON menu_items FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_menu_items" ON menu_items;
CREATE POLICY "admin_update_menu_items" ON menu_items FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_menu_items" ON menu_items;
CREATE POLICY "admin_delete_menu_items" ON menu_items FOR DELETE
  TO authenticated USING (is_admin());

-- ============================================================
-- ORDERS: GRANTS & POLICIES
-- ============================================================
GRANT INSERT ON orders TO anon, authenticated;
GRANT SELECT, UPDATE ON orders TO authenticated;

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_orders" ON orders;
CREATE POLICY "admin_select_orders" ON orders FOR SELECT
  TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- ORDER ITEMS: GRANTS & POLICIES
-- ============================================================
GRANT INSERT ON order_items TO anon, authenticated;
GRANT SELECT ON order_items TO authenticated;

DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_order_items" ON order_items;
CREATE POLICY "admin_select_order_items" ON order_items FOR SELECT
  TO authenticated USING (is_admin());

-- ============================================================
-- PAYMENTS: GRANTS & POLICIES
-- ============================================================
GRANT SELECT ON payments TO authenticated;
GRANT INSERT, UPDATE ON payments TO authenticated;

DROP POLICY IF EXISTS "admin_select_payments" ON payments;
CREATE POLICY "admin_select_payments" ON payments FOR SELECT
  TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_insert_payments" ON payments;
CREATE POLICY "admin_insert_payments" ON payments FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_payments" ON payments;
CREATE POLICY "admin_update_payments" ON payments FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- ORDER STATUS HISTORY: GRANTS & POLICIES
-- ============================================================
GRANT SELECT ON order_status_history TO authenticated;
GRANT INSERT ON order_status_history TO authenticated;

DROP POLICY IF EXISTS "admin_select_order_status_history" ON order_status_history;
CREATE POLICY "admin_select_order_status_history" ON order_status_history FOR SELECT
  TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_insert_order_status_history" ON order_status_history;
CREATE POLICY "admin_insert_order_status_history" ON order_status_history FOR INSERT
  TO authenticated WITH CHECK (is_admin());

-- ============================================================
-- MENU PRICE HISTORY: GRANTS & POLICIES
-- ============================================================
GRANT SELECT ON menu_price_history TO authenticated;

DROP POLICY IF EXISTS "admin_select_menu_price_history" ON menu_price_history;
CREATE POLICY "admin_select_menu_price_history" ON menu_price_history FOR SELECT
  TO authenticated USING (is_admin());

-- ============================================================
-- ADMIN USERS: GRANTS & POLICIES
-- ============================================================
GRANT SELECT ON admin_users TO authenticated;

DROP POLICY IF EXISTS "admin_read_admin_users" ON admin_users;
CREATE POLICY "admin_read_admin_users" ON admin_users FOR SELECT
  TO authenticated USING (is_admin());

-- ============================================================
-- RESTAURANT SETTINGS: GRANTS & POLICIES
-- ============================================================
GRANT SELECT ON restaurant_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON restaurant_settings TO authenticated;

DROP POLICY IF EXISTS "public_read_settings" ON restaurant_settings;
CREATE POLICY "public_read_settings" ON restaurant_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_upsert_settings" ON restaurant_settings;
CREATE POLICY "admin_upsert_settings" ON restaurant_settings FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_settings" ON restaurant_settings;
CREATE POLICY "admin_update_settings" ON restaurant_settings FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- CUSTOMER ORDER ACCESS FUNCTIONS (SECURITY DEFINER)
-- ============================================================

-- get_order_by_access_token(p_token): secure customer order lookup
CREATE OR REPLACE FUNCTION get_order_by_access_token(p_token uuid)
RETURNS TABLE (
  id uuid,
  order_number text,
  access_token uuid,
  customer_name text,
  customer_phone text,
  order_type text,
  table_reference text,
  notes text,
  status text,
  subtotal numeric(12,2),
  total numeric(12,2),
  payment_status text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    o.id, o.order_number, o.access_token, o.customer_name, o.customer_phone,
    o.order_type, o.table_reference, o.notes, o.status, o.subtotal, o.total,
    o.payment_status, o.created_at, o.updated_at
  FROM orders o
  WHERE o.access_token = p_token;
$$;

GRANT EXECUTE ON FUNCTION get_order_by_access_token(uuid) TO anon, authenticated;

-- get_order_items_by_access_token(p_token): returns items for a customer's order
CREATE OR REPLACE FUNCTION get_order_items_by_access_token(p_token uuid)
RETURNS TABLE (
  id uuid,
  order_id uuid,
  menu_item_id uuid,
  item_name text,
  unit_price numeric(12,2),
  quantity integer,
  line_total numeric(12,2)
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    oi.id, oi.order_id, oi.menu_item_id, oi.item_name, oi.unit_price,
    oi.quantity, oi.line_total
  FROM order_items oi
  JOIN orders o ON oi.order_id = o.id
  WHERE o.access_token = p_token;
$$;

GRANT EXECUTE ON FUNCTION get_order_items_by_access_token(uuid) TO anon, authenticated;

-- get_order_payments_by_access_token(p_token): returns payments for a customer's order
CREATE OR REPLACE FUNCTION get_order_payments_by_access_token(p_token uuid)
RETURNS TABLE (
  id uuid,
  method text,
  amount numeric(12,2),
  status text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    p.id, p.method, p.amount, p.status, p.created_at
  FROM payments p
  JOIN orders o ON p.order_id = o.id
  WHERE o.access_token = p_token;
$$;

GRANT EXECUTE ON FUNCTION get_order_payments_by_access_token(uuid) TO anon, authenticated;

-- generate_order_number(): returns next sequential order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num integer;
BEGIN
  SELECT COALESCE(MAX(seq_num), 0) + 1 INTO next_num
  FROM (
    SELECT CAST(
      NULLIF(
        REGEXP_REPLACE(order_number, '[^0-9]', '', 'g'),
        ''
      ) AS integer
    ) AS seq_num
    FROM orders
  ) sub;

  RETURN 'SFR-' || lpad(next_num::text, 6, '0');
END;
$$;

GRANT EXECUTE ON FUNCTION generate_order_number() TO anon, authenticated;