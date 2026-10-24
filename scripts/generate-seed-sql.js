// Generates seed SQL from the menu source data.
// Run: node scripts/generate-seed-sql.js

const fs = require('fs');
const path = require('path');

// Read the TS file and extract just the data arrays using a simple approach:
// we'll require a CommonJS-friendly version
const tempJsPath = path.join(__dirname, '_menu-data.cjs');
const tsContent = fs.readFileSync(path.join(__dirname, '..', 'lib', 'menu-data.ts'), 'utf8');

// Convert TS to JS: remove type annotations and export keywords
let jsContent = tsContent
  // Remove interface blocks
  .replace(/export interface \w+ \{[^}]*\}/g, '')
  // Remove type annotations from variable declarations
  .replace(/: SourceCategory\[\]/g, '')
  .replace(/: SourceMenuItem\[\]/g, '')
  // Remove export
  .replace(/export /g, '')
  // Remove function return type and param types
  .replace(/\): \w+ \{/g, ') {')
  .replace(/: Record<string, number>/g, '')
  // Remove the optional marker in interfaces (already removed) but fix any leftover
  .replace(/\?;/g, ';')
  // Convert const function params with types
  .replace(/\((\w+): (\w+)\)/g, '($1)')
  .replace(/: SourceMenuItem/g, '')
  .replace(/: SourceCategory/g, '')
  .replace(/: string/g, '')
  .replace(/: number/g, '')
  .replace(/: boolean/g, '');

// Add module.exports
jsContent += '\nmodule.exports = { SOURCE_CATEGORIES, SOURCE_MENU_ITEMS, getSourceKey, getSeedSummary };\n';

fs.writeFileSync(tempJsPath, jsContent);

let mod;
try {
  mod = require(tempJsPath);
} catch (e) {
  console.error('Error loading converted data:', e.message);
  console.error('---JS content preview---');
  console.error(jsContent.substring(0, 500));
  fs.unlinkSync(tempJsPath);
  process.exit(1);
}
fs.unlinkSync(tempJsPath);

const { SOURCE_CATEGORIES, SOURCE_MENU_ITEMS, getSourceKey, getSeedSummary } = mod;

function esc(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

let sql = '';

// Categories
sql += '-- Seed categories\n';
sql += 'INSERT INTO categories (name, slug, sort_order, is_active)\nSELECT * FROM (VALUES\n';
sql += SOURCE_CATEGORIES.map(c =>
  `  (${esc(c.name)}, ${esc(c.slug)}, ${c.sortOrder}, true)`
).join(',\n');
sql += '\n) AS v(name, slug, sort_order, is_active)\nON CONFLICT (slug) DO UPDATE SET\n  name = EXCLUDED.name,\n  sort_order = EXCLUDED.sort_order,\n  is_active = EXCLUDED.is_active;\n\n';

// Menu items
const catMap = {};
for (const c of SOURCE_CATEGORIES) {
  catMap[c.name] = c.slug;
}

sql += '-- Seed menu items (idempotent: preserves owner-approved prices and availability)\n';
sql += '-- Only updates name, original_name, description, sort_order, and re-activates.\n';
sql += '-- Does NOT overwrite price, price_verified_at, or is_available.\n';
sql += 'INSERT INTO menu_items (category_id, source_key, name, original_name, description, price, is_available, is_active, sort_order)\nSELECT c.id, v.source_key, v.name, v.original_name, v.description, v.price, false, true, v.sort_order\nFROM (VALUES\n';

const values = SOURCE_MENU_ITEMS.map((item, idx) => {
  const slug = catMap[item.category];
  const key = getSourceKey(item.category, item.name);
  const priceVal = item.price === null ? 'NULL' : esc(item.price);
  const descVal = esc(item.description || null);
  return `  (${esc(slug)}, ${esc(key)}, ${esc(item.name)}, ${esc(item.originalName)}, ${descVal}, ${priceVal}, ${idx + 1})`;
});

sql += values.join(',\n');
sql += '\n) AS v(slug, source_key, name, original_name, description, price, sort_order)\nJOIN categories c ON c.slug = v.slug\nON CONFLICT (source_key) DO UPDATE SET\n  name = EXCLUDED.name,\n  original_name = EXCLUDED.original_name,\n  description = EXCLUDED.description,\n  sort_order = EXCLUDED.sort_order,\n  is_active = true;\n\n';

// Summary
const summary = getSeedSummary();
sql += `-- Seed Summary:\n`;
sql += `--   Total source items: ${summary.total}\n`;
sql += `--   Priced items: ${summary.priced}\n`;
sql += `--   Unpriced items: ${summary.unpriced}\n`;
sql += `--   Categories: ${summary.categoryCount}\n`;

fs.writeFileSync(path.join(__dirname, 'seed.sql'), sql);
console.log('Generated scripts/seed.sql');
console.log(`Total items: ${summary.total}, Priced: ${summary.priced}, Unpriced: ${summary.unpriced}, Categories: ${summary.categoryCount}`);
