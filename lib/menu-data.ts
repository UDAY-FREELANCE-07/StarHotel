export interface SourceMenuItem {
  category: string;
  name: string;
  originalName: string;
  price: string | null;
  priceVerified: boolean;
  isAvailable: boolean;
  description?: string;
}

export interface SourceCategory {
  name: string;
  slug: string;
  sortOrder: number;
}

export const SOURCE_CATEGORIES: SourceCategory[] = [
  { name: 'Egg', slug: 'egg', sortOrder: 1 },
  { name: 'Veg Curries', slug: 'veg-curries', sortOrder: 2 },
  { name: 'Non Veg Curries', slug: 'non-veg-curries', sortOrder: 3 },
  { name: 'Tandoori', slug: 'tandoori', sortOrder: 4 },
  { name: 'Breads', slug: 'breads', sortOrder: 5 },
  { name: 'Noodles', slug: 'noodles', sortOrder: 6 },
  { name: 'Veg Fried Rice', slug: 'veg-fried-rice', sortOrder: 7 },
  { name: 'Non-Veg Fried Rice', slug: 'non-veg-fried-rice', sortOrder: 8 },
  { name: 'Biryanis — Vegetarian', slug: 'biryanis-vegetarian', sortOrder: 9 },
  { name: 'Chicken Biryani Section', slug: 'chicken-biryani', sortOrder: 10 },
  { name: 'Soups Veg', slug: 'soups-veg', sortOrder: 11 },
  { name: 'Soups Non Veg', slug: 'soups-non-veg', sortOrder: 12 },
  { name: 'Starters Veg', slug: 'starters-veg', sortOrder: 13 },
  { name: 'Thandoori Kabab Section', slug: 'thandoori-kabab', sortOrder: 14 },
  { name: 'Chicken Saters', slug: 'chicken-saters', sortOrder: 15 },
  { name: 'Mutton Saters', slug: 'mutton-saters', sortOrder: 16 },
  { name: 'Sea Starters', slug: 'sea-starters', sortOrder: 17 },
  { name: 'Pantry', slug: 'pantry', sortOrder: 18 },
  { name: 'Others', slug: 'others', sortOrder: 19 },
  { name: 'Star Special', slug: 'star-special', sortOrder: 20 },
];

const EGG: SourceMenuItem[] = [
  { category: 'Egg', name: 'Egg Fried Rice', originalName: 'Egg Fried Rice', price: '190.00', priceVerified: false, isAvailable: false },
  { category: 'Egg', name: 'Schezwan Egg Fried Rice', originalName: 'Schezwan Egg Fried Rice', price: '200.00', priceVerified: false, isAvailable: false },
  { category: 'Egg', name: 'Spl. Egg Fried Rice', originalName: 'Spl. Egg Fried Rice', price: '230.00', priceVerified: false, isAvailable: false },
];

const VEG_CURRIES: SourceMenuItem[] = [
  { category: 'Veg Curries', name: 'Mixed Veg Curry', originalName: 'Mixed Veg Curry', price: '200.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Kadai Veg', originalName: 'Kadai Veg', price: '220.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Veg Kolapuri', originalName: 'Veg Kolapuri', price: '220.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Veg Chat Pat', originalName: 'Veg Chat Pat', price: '220.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Methi Chaman', originalName: 'Methi Chaman', price: '250.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Aloo Gobi Masala', originalName: 'Aloo Gobi Masala', price: '220.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Paneer Butter Masala', originalName: 'Paneer Butter Masala', price: '240.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Paneer Kolapuri', originalName: 'Paneer Kolapuri', price: '240.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Kaju Paneer Masala', originalName: 'Kaju Paneer Masala', price: '320.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Paneer Chat Pat', originalName: 'Paneer Chat Pat', price: '240.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Kadai Paneer', originalName: 'Kadai Paneer', price: '240.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Palak Paneer', originalName: 'Palak Paneer', price: '240.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Baby Corn Masala', originalName: 'Baby Corn Masala', price: '240.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Kaju Masala', originalName: 'Kaju Masala', price: '320.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Curries', name: 'Tomato Kaju Curry', originalName: 'Tomato Kaju Curry', price: '320.00', priceVerified: false, isAvailable: false },
];

const NON_VEG_CURRIES: SourceMenuItem[] = [
  { category: 'Non Veg Curries', name: 'Telangana Chicken Curry', originalName: 'Telangana Chicken Curry', price: '270.00', priceVerified: false, isAvailable: false },
  { category: 'Non Veg Curries', name: 'Butter Chicken', originalName: 'Butter Chicken', price: '320.00', priceVerified: false, isAvailable: false },
  { category: 'Non Veg Curries', name: 'Chicken Masala', originalName: 'Chicken Masala', price: '270.00', priceVerified: false, isAvailable: false },
  { category: 'Non Veg Curries', name: 'Chicken Do Pyaza', originalName: 'Chicken Do Pyaza', price: '270.00', priceVerified: false, isAvailable: false },
  { category: 'Non Veg Curries', name: 'Kadai Chicken', originalName: 'Kadai Chicken', price: '270.00', priceVerified: false, isAvailable: false },
  { category: 'Non Veg Curries', name: 'Chicken Kolapuri', originalName: 'Chicken Kolapuri', price: '270.00', priceVerified: false, isAvailable: false },
  { category: 'Non Veg Curries', name: 'Chicken Tikka Masala', originalName: 'Chicken Tikka Masala', price: '320.00', priceVerified: false, isAvailable: false },
  { category: 'Non Veg Curries', name: 'Methi Chicken', originalName: 'Methi Chicken', price: '270.00', priceVerified: false, isAvailable: false },
  { category: 'Non Veg Curries', name: 'Tangidi Masala', originalName: 'Tangidi Masala', price: '320.00', priceVerified: false, isAvailable: false },
  { category: 'Non Veg Curries', name: 'Hyderabad Chicken', originalName: 'Hyderabad Chicken', price: '270.00', priceVerified: false, isAvailable: false },
  { category: 'Non Veg Curries', name: 'Chicken Mughalai', originalName: 'Chicken Mughalai', price: '270.00', priceVerified: false, isAvailable: false },
];

const TANDOORI: SourceMenuItem[] = [
  { category: 'Tandoori', name: 'Tangidi Kabab Full', originalName: 'Tangidi Kabab Full', price: '280.00', priceVerified: false, isAvailable: false },
  { category: 'Tandoori', name: 'Tangidi Kabab Half', originalName: 'Tangidi Kabab Half', price: '170.00', priceVerified: false, isAvailable: false },
  { category: 'Tandoori', name: 'Tandoori Chicken Full', originalName: 'Tandoori Chicken Full', price: '530.00', priceVerified: false, isAvailable: false },
  { category: 'Tandoori', name: 'Tandoori Chicken Half', originalName: 'Tandoori Chicken Half', price: '280.00', priceVerified: false, isAvailable: false },
  { category: 'Tandoori', name: 'Chicken Tikka', originalName: 'Chicken Tikka', price: '280.00', priceVerified: false, isAvailable: false },
  { category: 'Tandoori', name: 'Pudina Kabab', originalName: 'Pudina Kabab', price: '300.00', priceVerified: false, isAvailable: false },
];

const BREADS: SourceMenuItem[] = [
  { category: 'Breads', name: 'Butter Naan', originalName: 'Butter Naan', price: '35.00', priceVerified: false, isAvailable: false },
  { category: 'Breads', name: 'Plain Naan', originalName: 'Plain Naan', price: '30.00', priceVerified: false, isAvailable: false },
  { category: 'Breads', name: 'Roti', originalName: 'Roti', price: '25.00', priceVerified: false, isAvailable: false },
  { category: 'Breads', name: 'Butter Roti', originalName: 'Butter Roti', price: '30.00', priceVerified: false, isAvailable: false },
  { category: 'Breads', name: 'Pulka', originalName: 'Pulka', price: '20.00', priceVerified: false, isAvailable: false },
  { category: 'Breads', name: 'Masala Kulcha', originalName: 'Masala Kulcha', price: '60.00', priceVerified: false, isAvailable: false },
  { category: 'Breads', name: 'Palin Kulcha', originalName: 'Palin Kulcha', price: '40.00', priceVerified: false, isAvailable: false },
  { category: 'Breads', name: 'Chicken Kulcha', originalName: 'Chicken Kulcha', price: '100.00', priceVerified: false, isAvailable: false },
  { category: 'Breads', name: 'Mutton Kulcha', originalName: 'Mutton Kulcha', price: '150.00', priceVerified: false, isAvailable: false },
  { category: 'Breads', name: 'Paneer Kulcha', originalName: 'Paneer Kulcha', price: '60.00', priceVerified: false, isAvailable: false },
  { category: 'Breads', name: 'Garlic Naan', originalName: 'Garlic Naan', price: '50.00', priceVerified: false, isAvailable: false },
];

const NOODLES: SourceMenuItem[] = [
  { category: 'Noodles', name: 'Veg Soft Noodles', originalName: 'Veg Soft Noodles', price: '120.00', priceVerified: false, isAvailable: false },
  { category: 'Noodles', name: 'Veg Schezwan Noodles', originalName: 'Veg Schezwan Noodles', price: '140.00', priceVerified: false, isAvailable: false },
  { category: 'Noodles', name: 'Veg Garlic Noodles', originalName: 'Veg Garlic Noodles', price: '140.00', priceVerified: false, isAvailable: false },
  { category: 'Noodles', name: 'Chicken Soft Noodles', originalName: 'Chicken Soft Noodles', price: '170.00', priceVerified: false, isAvailable: false },
  { category: 'Noodles', name: 'Chicken Schezwan Noodles', originalName: 'Chicken Schezwan Noodles', price: '180.00', priceVerified: false, isAvailable: false },
  { category: 'Noodles', name: 'Chicken Garlic Noodles', originalName: 'Chicken Garlic Noodles', price: '180.00', priceVerified: false, isAvailable: false },
  { category: 'Noodles', name: 'Egg Soft Noodles', originalName: 'Egg Soft Noodles', price: '150.00', priceVerified: false, isAvailable: false },
  { category: 'Noodles', name: 'Egg Schezwan Noodles', originalName: 'Egg Schezwan Noodles', price: '150.00', priceVerified: false, isAvailable: false },
];

const VEG_FRIED_RICE: SourceMenuItem[] = [
  { category: 'Veg Fried Rice', name: 'Veg Fried Rice', originalName: 'Veg Fried Rice', price: '200.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Fried Rice', name: 'Veg Schezwan Rice', originalName: 'Veg Schezwan Rice', price: '200.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Fried Rice', name: 'Paneer Fried Rice', originalName: 'Paneer Fried Rice', price: '250.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Fried Rice', name: 'Mashroom Fried Rice', originalName: 'Mashroom Fried Rice', price: '250.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Fried Rice', name: 'Kaju Fried Rice', originalName: 'Kaju Fried Rice', price: '320.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Fried Rice', name: 'Spl. Veg Fried Rice', originalName: 'Spl. Veg Fried Rice', price: '220.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Fried Rice', name: 'Jeera Rice', originalName: 'Jeera Rice', price: '140.00', priceVerified: false, isAvailable: false },
  { category: 'Veg Fried Rice', name: 'Curd Rice', originalName: 'Curd Rice', price: '100.00', priceVerified: false, isAvailable: false },
];

const NON_VEG_FRIED_RICE: SourceMenuItem[] = [
  { category: 'Non-Veg Fried Rice', name: 'Chicken Fried Rice', originalName: 'Chicken Fried Rice', price: '200.00', priceVerified: false, isAvailable: false },
  { category: 'Non-Veg Fried Rice', name: 'Spl. Chicken Fried Rice', originalName: 'Spl. Chicken Fried Rice', price: '240.00', priceVerified: false, isAvailable: false },
  { category: 'Non-Veg Fried Rice', name: 'Schezwan Chicken Fried Rice', originalName: 'Schezwan Chicken Fried Rice', price: '220.00', priceVerified: false, isAvailable: false },
  { category: 'Non-Veg Fried Rice', name: 'Spl. Schezwan Chicken Fried Rice', originalName: 'Spl. Schezwan Chicken Fried Rice', price: '250.00', priceVerified: false, isAvailable: false },
];

const BIRYANIS_VEG: SourceMenuItem[] = [
  { category: 'Biryanis — Vegetarian', name: 'Veg Biryani', originalName: 'Veg Biryani', price: '230.00', priceVerified: false, isAvailable: false },
  { category: 'Biryanis — Vegetarian', name: 'Spl. Veg Biryani', originalName: 'Spl. Veg Biryani', price: '260.00', priceVerified: false, isAvailable: false },
  { category: 'Biryanis — Vegetarian', name: 'Veg Biryani Family Pack', originalName: 'Veg Biryani Family Pack', price: '440.00', priceVerified: false, isAvailable: false },
  { category: 'Biryanis — Vegetarian', name: 'Veg. Biryani Spl. Family Pack', originalName: 'Veg. Biryani Spl. Family Pack', price: '490.00', priceVerified: false, isAvailable: false },
  { category: 'Biryanis — Vegetarian', name: 'Paneer Biryani', originalName: 'Paneer Biryani', price: '250.00', priceVerified: false, isAvailable: false },
  { category: 'Biryanis — Vegetarian', name: 'Paneer Biryani Family Pack', originalName: 'Paneer Biryani Family Pack', price: '440.00', priceVerified: false, isAvailable: false },
  { category: 'Biryanis — Vegetarian', name: 'Masroom Biryani', originalName: 'Masroom Biryani', price: '250.00', priceVerified: false, isAvailable: false },
  { category: 'Biryanis — Vegetarian', name: 'Masroom Biryani Family Pack', originalName: 'Masroom Biryani Family Pack', price: '440.00', priceVerified: false, isAvailable: false },
  { category: 'Biryanis — Vegetarian', name: 'Kaju Biryani', originalName: 'Kaju Biryani', price: '350.00', priceVerified: false, isAvailable: false },
  { category: 'Biryanis — Vegetarian', name: 'Kaju Biryani Family Pack', originalName: 'Kaju Biryani Family Pack', price: '650.00', priceVerified: false, isAvailable: false },
  { category: 'Biryanis — Vegetarian', name: 'Kaju Paneer Biryani', originalName: 'Kaju Paneer Biryani', price: '350.00', priceVerified: false, isAvailable: false },
  { category: 'Biryanis — Vegetarian', name: 'Kaju Paneer Biryani Family Pack', originalName: 'Kaju Paneer Biryani Family Pack', price: '680.00', priceVerified: false, isAvailable: false },
];

const CHICKEN_BIRYANI: SourceMenuItem[] = [
  { category: 'Chicken Biryani Section', name: 'Chicken Biryani Single', originalName: 'Chicken Biryani Single', price: '150.00', priceVerified: false, isAvailable: false },
  { category: 'Chicken Biryani Section', name: 'Chicken Biryani Plate', originalName: 'Chicken Biryani Plate', price: '270.00', priceVerified: false, isAvailable: false },
  { category: 'Chicken Biryani Section', name: 'Chicken Biryani Family Pack', originalName: 'Chicken Biryani Family Pack', price: '500.00', priceVerified: false, isAvailable: false },
  { category: 'Chicken Biryani Section', name: 'Thandoori Chicken Biryani Plate', originalName: 'Thandoori Chicken Biryani Plate', price: '300.00', priceVerified: false, isAvailable: false },
  { category: 'Chicken Biryani Section', name: 'Thandoori Chicken Biryani Family', originalName: 'Thandoori Chicken Biryani Family', price: '550.00', priceVerified: false, isAvailable: false },
  { category: 'Chicken Biryani Section', name: 'Tangidi Chicken Biryani Plate', originalName: 'Tangidi Chicken Biryani Plate', price: '300.00', priceVerified: false, isAvailable: false },
  { category: 'Chicken Biryani Section', name: 'Tangidi Chicken Biryani Family Pack', originalName: 'Tangidi Chicken Biryani Family Pack', price: '550.00', priceVerified: false, isAvailable: false },
  { category: 'Chicken Biryani Section', name: 'Chicken Biryani Spl', originalName: 'Chicken Biryani Spl', price: '300.00', priceVerified: false, isAvailable: false },
  { category: 'Chicken Biryani Section', name: 'Chicken Biryani Spl. Family Pack', originalName: 'Chicken Biryani Spl. Family Pack', price: '550.00', priceVerified: false, isAvailable: false },
];

const SOUPS_VEG: SourceMenuItem[] = [
  { category: 'Soups Veg', name: 'Tomato Soups', originalName: 'Tomato Soups', price: null, priceVerified: false, isAvailable: false },
  { category: 'Soups Veg', name: 'Hot & Sour Soup', originalName: 'Hot & Sour Soup', price: null, priceVerified: false, isAvailable: false },
  { category: 'Soups Veg', name: 'Veg Manchow Soup', originalName: 'Veg Manchow Soup', price: null, priceVerified: false, isAvailable: false },
  { category: 'Soups Veg', name: 'Veg Corn Soup', originalName: 'Veg Corn Soup', price: null, priceVerified: false, isAvailable: false },
];

const SOUPS_NON_VEG: SourceMenuItem[] = [
  { category: 'Soups Non Veg', name: 'Chicken Manchow Soup', originalName: 'Chicken Manchow Soup', price: null, priceVerified: false, isAvailable: false },
  { category: 'Soups Non Veg', name: 'Chicken Corn Soup', originalName: 'Chicken Corn Soup', price: null, priceVerified: false, isAvailable: false },
  { category: 'Soups Non Veg', name: 'Chicken Hot N Sour Soup', originalName: 'Chicken Hot N Sour Soup', price: null, priceVerified: false, isAvailable: false },
];

const STARTERS_VEG: SourceMenuItem[] = [
  { category: 'Starters Veg', name: 'Paneer Tikka', originalName: 'Paneer Tikka', price: null, priceVerified: false, isAvailable: false },
  { category: 'Starters Veg', name: 'Chilli Paneer', originalName: 'Chilli Paneer', price: null, priceVerified: false, isAvailable: false },
  { category: 'Starters Veg', name: 'Paneer 65', originalName: 'Paneer 65', price: null, priceVerified: false, isAvailable: false },
  { category: 'Starters Veg', name: 'Veg Manchuriya (Dry/wet)', originalName: 'Veg Manchuriya (Dry/wet)', price: null, priceVerified: false, isAvailable: false },
  { category: 'Starters Veg', name: 'Veg 65 (Aloo gobi)', originalName: 'Veg 65 (Aloo gobi)', price: null, priceVerified: false, isAvailable: false },
  { category: 'Starters Veg', name: 'Baby Corn Manchuriya', originalName: 'Baby Corn Manchuriya', price: null, priceVerified: false, isAvailable: false },
  { category: 'Starters Veg', name: 'Egg Manchuriya', originalName: 'Egg Manchuriya', price: null, priceVerified: false, isAvailable: false },
];

const THANDOORI_KABAB: SourceMenuItem[] = [
  { category: 'Thandoori Kabab Section', name: 'Thangidi Kabab Full', originalName: 'Thangidi Kabab Full', price: null, priceVerified: false, isAvailable: false, description: 'Flagged for owner review: likely overlaps with Tangidi Kabab Full in the Tandoori section.' },
  { category: 'Thandoori Kabab Section', name: 'Thangidi Kabab Off', originalName: 'Thangidi Kabab Off', price: null, priceVerified: false, isAvailable: false, description: 'Flagged for owner review: likely overlaps with Tangidi Kabab Half in the Tandoori section.' },
  { category: 'Thandoori Kabab Section', name: 'Thanduri Chicken Full', originalName: 'Thanduri Chicken Full', price: null, priceVerified: false, isAvailable: false, description: 'Flagged for owner review: likely overlaps with Tandoori Chicken Full in the Tandoori section.' },
  { category: 'Thandoori Kabab Section', name: 'Thanduri Chicken Off', originalName: 'Thanduri Chicken Off', price: null, priceVerified: false, isAvailable: false, description: 'Flagged for owner review: likely overlaps with Tandoori Chicken Half in the Tandoori section.' },
  { category: 'Thandoori Kabab Section', name: 'Thandoori Full Bird', originalName: 'Thandoori Full Bird', price: null, priceVerified: false, isAvailable: false, description: 'Flagged for owner review: likely overlaps with Tandoori Chicken Full in the Tandoori section.' },
];

const CHICKEN_STATERS: SourceMenuItem[] = [
  { category: 'Chicken Saters', name: 'Chicken Maiestic', originalName: 'Chicken Maiestic', price: null, priceVerified: false, isAvailable: false },
  { category: 'Chicken Saters', name: 'Chicken Manchuriya', originalName: 'Chicken Manchuriya', price: null, priceVerified: false, isAvailable: false },
  { category: 'Chicken Saters', name: 'Paper Chicken', originalName: 'Paper Chicken', price: null, priceVerified: false, isAvailable: false },
  { category: 'Chicken Saters', name: 'Schezwan Chicken', originalName: 'Schezwan Chicken', price: null, priceVerified: false, isAvailable: false },
  { category: 'Chicken Saters', name: 'Chicken 65', originalName: 'Chicken 65', price: null, priceVerified: false, isAvailable: false },
  { category: 'Chicken Saters', name: 'Dragon Chicken', originalName: 'Dragon Chicken', price: null, priceVerified: false, isAvailable: false },
];

const MUTTON_STATERS: SourceMenuItem[] = [
  { category: 'Mutton Saters', name: 'Mutton 65', originalName: 'Mutton 65', price: null, priceVerified: false, isAvailable: false },
  { category: 'Mutton Saters', name: 'Chilly Mutton', originalName: 'Chilly Mutton', price: null, priceVerified: false, isAvailable: false },
];

const SEA_STARTERS: SourceMenuItem[] = [
  { category: 'Sea Starters', name: 'Apollo Fish', originalName: 'Apollo Fish', price: null, priceVerified: false, isAvailable: false },
  { category: 'Sea Starters', name: 'Chilly Fish', originalName: 'Chilly Fish', price: null, priceVerified: false, isAvailable: false },
  { category: 'Sea Starters', name: 'Chilly Prawns', originalName: 'Chilly Prawns', price: null, priceVerified: false, isAvailable: false },
  { category: 'Sea Starters', name: 'Loose Prawns', originalName: 'Loose Prawns', price: null, priceVerified: false, isAvailable: false },
];

const PANTRY: SourceMenuItem[] = [
  { category: 'Pantry', name: 'Lassi', originalName: 'Lassi', price: null, priceVerified: false, isAvailable: false },
  { category: 'Pantry', name: 'Mazza', originalName: 'Mazza', price: null, priceVerified: false, isAvailable: false },
  { category: 'Pantry', name: 'Thums Up', originalName: 'Thums Up', price: null, priceVerified: false, isAvailable: false },
  { category: 'Pantry', name: 'Sprite', originalName: 'Sprite', price: null, priceVerified: false, isAvailable: false },
  { category: 'Pantry', name: 'Kinley', originalName: 'Kinley', price: null, priceVerified: false, isAvailable: false },
  { category: 'Pantry', name: 'Pulpy Orange', originalName: 'Pulpy Orange', price: null, priceVerified: false, isAvailable: false },
];

const OTHERS: SourceMenuItem[] = [
  { category: 'Others', name: 'Mixed Non-Veg Fried Rice', originalName: 'Mixed Non-Veg Fried Rice', price: '500.00', priceVerified: false, isAvailable: false, description: 'Chicken, mutton, prawns, fish' },
  { category: 'Others', name: 'Mutton Fried Rice', originalName: 'Mutton Fried Rice', price: '400.00', priceVerified: false, isAvailable: false },
  { category: 'Others', name: 'Fish Fried Rice', originalName: 'Fish Fried Rice', price: '300.00', priceVerified: false, isAvailable: false },
  { category: 'Others', name: 'Prawns Fried Rice', originalName: 'Prawns Fried Rice', price: '300.00', priceVerified: false, isAvailable: false },
  { category: 'Others', name: 'Punjabi Chicken', originalName: 'Punjabi Chicken', price: '320.00', priceVerified: false, isAvailable: false },
  { category: 'Others', name: 'Bonless Chicken Curry', originalName: 'Bonless Chicken Curry', price: '350.00', priceVerified: false, isAvailable: false },
  { category: 'Others', name: 'Mutton Masala', originalName: 'Mutton Masala', price: '450.00', priceVerified: false, isAvailable: false },
  { category: 'Others', name: 'Telangana Mutton Curry', originalName: 'Telangana Mutton Curry', price: '450.00', priceVerified: false, isAvailable: false },
  { category: 'Others', name: 'Butter Mutton', originalName: 'Butter Mutton', price: '450.00', priceVerified: false, isAvailable: false },
  { category: 'Others', name: 'Kadai Mutton', originalName: 'Kadai Mutton', price: '450.00', priceVerified: false, isAvailable: false },
  { category: 'Others', name: 'Hyderabad Mutton', originalName: 'Hyderabad Mutton', price: '450.00', priceVerified: false, isAvailable: false },
  { category: 'Others', name: 'Fish Masala', originalName: 'Fish Masala', price: '320.00', priceVerified: false, isAvailable: false },
  { category: 'Others', name: 'Prawns Masala', originalName: 'Prawns Masala', price: '320.00', priceVerified: false, isAvailable: false },
];

const STAR_SPECIAL: SourceMenuItem[] = [
  { category: 'Star Special', name: 'Raagi Sangati With Natu Kodi Pulusu (Star Special)', originalName: 'Raagi Sangati With Natu Kodi Pulusu (Star Special)', price: null, priceVerified: false, isAvailable: false },
];

export const SOURCE_MENU_ITEMS: SourceMenuItem[] = [
  ...EGG,
  ...VEG_CURRIES,
  ...NON_VEG_CURRIES,
  ...TANDOORI,
  ...BREADS,
  ...NOODLES,
  ...VEG_FRIED_RICE,
  ...NON_VEG_FRIED_RICE,
  ...BIRYANIS_VEG,
  ...CHICKEN_BIRYANI,
  ...SOUPS_VEG,
  ...SOUPS_NON_VEG,
  ...STARTERS_VEG,
  ...THANDOORI_KABAB,
  ...CHICKEN_STATERS,
  ...MUTTON_STATERS,
  ...SEA_STARTERS,
  ...PANTRY,
  ...OTHERS,
  ...STAR_SPECIAL,
];

export function getSourceKey(category: string, name: string): string {
  return `${category}::${name}`;
}

export function getSeedSummary() {
  const total = SOURCE_MENU_ITEMS.length;
  const priced = SOURCE_MENU_ITEMS.filter((i) => i.price !== null).length;
  const unpriced = total - priced;
  const byCategory: Record<string, number> = {};
  for (const item of SOURCE_MENU_ITEMS) {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
  }
  return { total, priced, unpriced, categoryCount: SOURCE_CATEGORIES.length, byCategory };
}
