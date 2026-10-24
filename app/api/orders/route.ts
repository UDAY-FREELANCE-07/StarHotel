import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { calculateLineTotal, calculateSubtotal } from '@/lib/pricing';

const orderItemSchema = z.object({
  menu_item_id: z.string().uuid(),
  item_name: z.string().min(1).max(200),
  unit_price: z.number().nonnegative(),
  quantity: z.number().int().positive().max(99),
  line_total: z.number().nonnegative(),
});

const createOrderSchema = z.object({
  customer_name: z.string().min(1).max(100),
  customer_phone: z.string().min(1).max(20),
  order_type: z.enum(['DINE_IN', 'TAKEAWAY']),
  table_reference: z.string().max(50).nullish(),
  notes: z.string().max(500).nullish(),
  items: z.array(orderItemSchema).min(1).max(50),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid order data', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { customer_name, customer_phone, order_type, table_reference, notes, items } = parsed.data;

    const menuItemIds = items.map(i => i.menu_item_id);
    const supabaseAdmin = getSupabaseAdmin();
    const { data: dbItems, error: dbError } = await supabaseAdmin
      .from('menu_items')
      .select('id, name, price, is_available, is_active')
      .in('id', menuItemIds);

    if (dbError) {
      return NextResponse.json({ error: 'Failed to verify menu items' }, { status: 500 });
    }

    const dbItemMap = new Map(dbItems?.map(i => [i.id, i]) || []);

    const verifiedItems: {
      menu_item_id: string;
      item_name: string;
      unit_price: number;
      quantity: number;
      line_total: number;
    }[] = [];

    const errors: string[] = [];

    for (const clientItem of items) {
      const dbItem = dbItemMap.get(clientItem.menu_item_id);

      if (!dbItem) {
        errors.push(`Item not found: ${clientItem.item_name}`);
        continue;
      }

      if (!dbItem.is_active) {
        errors.push(`Item no longer available: ${dbItem.name}`);
        continue;
      }

      if (!dbItem.is_available) {
        errors.push(`Item not currently available for ordering: ${dbItem.name}`);
        continue;
      }

      if (dbItem.price === null) {
        errors.push(`Item has no approved price: ${dbItem.name}`);
        continue;
      }

      const serverPrice = parseFloat(dbItem.price);

      if (clientItem.unit_price !== serverPrice) {
        errors.push(`Price mismatch for ${dbItem.name}: expected ₹${serverPrice.toFixed(2)}, got ₹${clientItem.unit_price.toFixed(2)}`);
        continue;
      }

      verifiedItems.push({
        menu_item_id: dbItem.id,
        item_name: dbItem.name,
        unit_price: serverPrice,
        quantity: clientItem.quantity,
        line_total: calculateLineTotal(serverPrice, clientItem.quantity),
      });
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Order validation failed', details: errors }, { status: 400 });
    }

    if (verifiedItems.length === 0) {
      return NextResponse.json({ error: 'No valid items in order' }, { status: 400 });
    }

    const subtotal = calculateSubtotal(verifiedItems);

    const { data: orderNumber, error: numError } = await supabaseAdmin
      .rpc('generate_order_number');

    if (numError || !orderNumber) {
      return NextResponse.json({ error: 'Failed to generate order number' }, { status: 500 });
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_phone,
        order_type,
        table_reference: table_reference || null,
        notes: notes || null,
        status: 'PENDING',
        subtotal,
        total: subtotal,
        payment_status: 'UNPAID',
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const orderItemsData = verifiedItems.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      item_name: item.item_name,
      unit_price: item.unit_price,
      quantity: item.quantity,
      line_total: item.line_total,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.order_number,
      accessToken: order.access_token,
      total: order.total,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
