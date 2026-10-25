/*
# Approve Owner-Supplied Menu Prices

## Overview
The restaurant owner has approved the supplied menu prices for online ordering.
This migration marks all 100 priced items as price-verified and available for ordering,
while leaving the 38 unpriced items unchanged (still not orderable).

## Changes
- Sets `price_verified_at` to current timestamp for all items that have a price.
- Sets `is_available = true` for all items that have a price.
- Does NOT touch items with NULL price (they remain unavailable).
- Does NOT touch the 5 flagged duplicate items in Thandoori Kabab Section (they have no price).

## Rationale
The seed script intentionally blocked all items pending owner approval.
The owner has now confirmed the prices are correct and approved for publication.
*/
UPDATE menu_items
SET
  price_verified_at = now(),
  is_available = true
WHERE price IS NOT NULL
  AND is_active = true;
