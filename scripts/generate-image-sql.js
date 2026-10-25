// Maps each menu item to a Pexels stock photo that best matches the dish.
// Photos are real food photography sourced from Pexels (license-free).

const P = (id, ext = 'jpeg') =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&h=600&w=800`;

// Category photo pools (rotated across items in each category)
const pools = {
  egg: [32845321, 28503594, 38987528],
  'veg-curries': [28867523, 35041649, 13823417, 20689162, 35041650, 11115801, 12737799, 5127316],
  'non-veg-curries': [40262820, 40262819, 40262818, 35158690, 20408442, 10508207, 12089284],
  tandoori: [36895285, 9646843, 9646859, 36097084, 37076319, 20371525],
  breads: [33194595, 5589941, 34943740, 34943745, 32558920, 33556462],
  noodles: [28895971, 37165674, 28895969, 4569049, 5848494, 30676160],
  'veg-fried-rice': [8992927, 3926124, 16872037, 7758253, 5638541],
  'non-veg-fried-rice': [34613243, 7758253, 3926124, 5720819],
  'biryanis-vegetarian': [37303308, 35287413, 35287417, 28909536, 5410401, 8250738, 33456864, 9738983],
  'chicken-biryani': [35287413, 35287417, 5410401, 8250738, 33456864, 9738983, 28909536],
  'soups-veg': [13790510, 25325508, 5409027, 16845652],
  'soups-non-veg': [5409027, 16845652, 25325508],
  'starters-veg': [3928854, 33430556, 29173105, 35066808, 34541595, 28674547],
  'thandoori-kabab': [36097084, 20371525, 36895285, 9646843, 9646859],
  'chicken-saters': [7353380, 35071822, 2124699, 35071815, 28674535, 7353388],
  'mutton-saters': [28674568, 9609846],
  'sea-starters': [10810652, 35267289, 9609841, 33413491],
  pantry: [14509267, 17200460, 4113654, 4113617, 4113686],
  others: [7758253, 3926124, 34613243, 8992927, 10508207, 20408442, 32986465, 9609846, 28674568, 29684989, 35267289, 14537690],
  'star-special': [35539324],
};

// PNG exceptions
const pngIds = new Set([3928854]);

// All 138 items: [id, category_slug]
const items = [
  // egg
  ['6c8fc763-7cec-4a49-957d-58064055a4f5', 'egg'],
  ['7aad56b2-ac95-4b66-a005-cf4e6cc0904c', 'egg'],
  ['50f7c8ad-15ae-404f-9915-c96baf176578', 'egg'],
  // veg-curries
  ['1cd51c07-ac36-4b4d-aad0-37a3f6cc986a', 'veg-curries'],
  ['47193fdd-dd04-41bc-8739-b9fa30b035cf', 'veg-curries'],
  ['cff29f8d-e085-4217-9ba8-4b06c057c6c5', 'veg-curries'],
  ['026c97a2-99d7-417f-a376-dd00420d628f', 'veg-curries'],
  ['4b5de411-35d3-4c45-a29a-eb9e1c43923c', 'veg-curries'],
  ['a1308b04-ccb0-4de3-9efe-af4d10b9e2c1', 'veg-curries'],
  ['ee4403d5-a904-4469-b6ba-76340892e45b', 'veg-curries'],
  ['50ed4d17-7417-4721-86b7-ad98f894f50e', 'veg-curries'],
  ['4cfc234d-1f4a-47b2-8d68-9991b51ecb8b', 'veg-curries'],
  ['f08dbc4b-d4a1-4c22-8198-a51547050899', 'veg-curries'],
  ['204be00b-aa59-435c-91a6-d3f9dd6a60c9', 'veg-curries'],
  ['05e29d8a-c2d4-4c02-abdf-315da2dc7839', 'veg-curries'],
  ['061fe64a-2ae5-41b5-907d-40aafc940b44', 'veg-curries'],
  ['3a5ba02a-a75f-4390-9c71-c9c9a6882349', 'veg-curries'],
  ['ec45414b-9b8d-4115-bafe-e908c80fdff3', 'veg-curries'],
  // non-veg-curries
  ['c880d9f0-369c-4e97-9cae-236ba95dabc2', 'non-veg-curries'],
  ['95dc778b-784f-4713-9e2e-24a708f72637', 'non-veg-curries'],
  ['14293a70-f132-470d-a86b-39e8f0b0198e', 'non-veg-curries'],
  ['c41cc476-cde0-4e13-99f8-0e8c37b9cd1a', 'non-veg-curries'],
  ['d2aba92e-9b11-4160-b8f3-e041d2d9dff8', 'non-veg-curries'],
  ['7af1b008-0c2f-429e-a459-9ed759691932', 'non-veg-curries'],
  ['486028a1-0ed4-4a3b-b6b2-b3e29e44ad36', 'non-veg-curries'],
  ['f6be9b6d-cf20-4fa3-be2e-c8235640408f', 'non-veg-curries'],
  ['4b6f6ca0-e362-4390-b20f-c16366f9906e', 'non-veg-curries'],
  ['194dec26-00ed-4859-be9f-7c5cc1334171', 'non-veg-curries'],
  ['10ff879b-bf12-4530-959b-722f9aa8d0d0', 'non-veg-curries'],
  // tandoori
  ['dc1039bb-40b0-4dc1-9f44-56e1657d9169', 'tandoori'],
  ['34650834-95bc-40fd-a5c6-8dd17b4cdf74', 'tandoori'],
  ['5daae1fc-7f16-49c7-be0d-57662f65433f', 'tandoori'],
  ['bc6b0b59-4724-44c7-996e-0d19bb583453', 'tandoori'],
  ['1a3b4294-13e5-449f-835f-d281c323881b', 'tandoori'],
  ['f9761a79-78e3-4fa8-b302-cd1c2a750f57', 'tandoori'],
  // breads
  ['f13aa1e8-cee4-4c78-92cb-a11718b1d72e', 'breads'],
  ['b93720c9-628e-4652-94f8-1f1f2df819e3', 'breads'],
  ['cf65dfc2-fdb4-4fcd-956b-7f8cbd92506d', 'breads'],
  ['d6ff4057-6bae-4cfe-b413-bc49b78e915a', 'breads'],
  ['4a53cf2a-9432-46e5-baeb-d6f073d1b6d2', 'breads'],
  ['c030d978-6f8b-4de9-b185-668eafdb18a3', 'breads'],
  ['2a2784f2-28fb-4f2e-a3ac-14fbcf913485', 'breads'],
  ['dfb81018-a3f9-440b-b10f-0bb1526fad44', 'breads'],
  ['2b35057b-470c-4c97-adee-948058eef06d', 'breads'],
  ['eb4c8d2d-35d2-4832-81e2-aa3f2fd8df64', 'breads'],
  ['0cd4cfb5-1042-4005-a5a3-c5d592c49cb8', 'breads'],
  // noodles
  ['69131807-156d-42b8-bf7f-cd3e5fa5947a', 'noodles'],
  ['e206e88c-b8a5-4b42-bd52-585e0df2ca1c', 'noodles'],
  ['4c267af8-d31e-43a2-a7ae-1e7c4f114abb', 'noodles'],
  ['05c332ea-78e4-4ecd-8b1e-30cf17ca60a5', 'noodles'],
  ['77408042-f271-45ad-9bd8-65a289a447fe', 'noodles'],
  ['b3bfa3aa-3590-4f34-ba10-84b7d3fbad90', 'noodles'],
  ['8bdcb0c9-8d2f-4e26-a5c5-72ddbac2fd70', 'noodles'],
  ['73490551-2eba-469d-923c-9eb7ffb41842', 'noodles'],
  // veg-fried-rice
  ['ab53702b-66c7-4d52-adb6-469efe77892a', 'veg-fried-rice'],
  ['7d4f4d8e-c62c-4481-89cb-5fd477bae1a5', 'veg-fried-rice'],
  ['9aca5e88-d805-430b-b562-03557a68fdf8', 'veg-fried-rice'],
  ['a0af78d8-0766-4402-8557-57607c5b0f04', 'veg-fried-rice'],
  ['fc787647-47ac-4b08-9ce2-18c37f60a1ce', 'veg-fried-rice'],
  ['3ff546ab-887a-45b7-848a-4a182b31c877', 'veg-fried-rice'],
  ['ad0c367d-75bd-4f56-821a-e01de97e95c5', 'veg-fried-rice'],
  ['f2549d7b-13fb-482b-9457-72837402af00', 'veg-fried-rice'],
  // non-veg-fried-rice
  ['0add9754-0d6c-4633-ba09-561b8c43e5f7', 'non-veg-fried-rice'],
  ['c33a8115-791e-416b-9d2e-c30466f8ff05', 'non-veg-fried-rice'],
  ['97b09966-d8be-4b5e-ab81-98b7b6751e92', 'non-veg-fried-rice'],
  ['742c18b6-43d8-402f-b3fd-1fa46aec63e7', 'non-veg-fried-rice'],
  // biryanis-vegetarian
  ['7b8d575e-3ca6-481e-82fc-42fe6e7d81cc', 'biryanis-vegetarian'],
  ['0443f8ad-9734-4c42-a317-cf6d314e9ae3', 'biryanis-vegetarian'],
  ['ea9ec830-1085-4021-9cf4-179d958afbc7', 'biryanis-vegetarian'],
  ['70231506-f365-4d75-86ac-dca53b77a535', 'biryanis-vegetarian'],
  ['58b94710-5d07-499a-849c-da9c2ee39c52', 'biryanis-vegetarian'],
  ['a909849d-6721-42d5-b01c-07491f8ec398', 'biryanis-vegetarian'],
  ['86199d57-f830-4694-a516-91582fb6da68', 'biryanis-vegetarian'],
  ['fb8d3a72-9c22-477c-8522-24a8ed4b3607', 'biryanis-vegetarian'],
  ['78281599-2818-4c7f-a367-0088ca230f88', 'biryanis-vegetarian'],
  ['58a1d2d6-dbd8-4b99-bcf0-bfd86bbd83d3', 'biryanis-vegetarian'],
  ['0322e427-4b7e-49e3-95d4-ce4b7fb01871', 'biryanis-vegetarian'],
  ['6ca6ba76-7f69-47b3-8a59-1ffbe2c62b8d', 'biryanis-vegetarian'],
  // chicken-biryani
  ['5b5f9ec1-97c5-4d33-9031-d63668b03c0d', 'chicken-biryani'],
  ['bea6f637-7226-40cc-a1bb-04abe26ebff0', 'chicken-biryani'],
  ['36512bee-1ecb-41b1-98b7-392a35d14d9a', 'chicken-biryani'],
  ['5bbfda54-3d21-4b7a-9c1f-b15d14be5f2d', 'chicken-biryani'],
  ['6d6da31b-943d-45c5-b4bf-fa0935888ddf', 'chicken-biryani'],
  ['1d8be277-658a-484f-a1f5-b64ce02f7f15', 'chicken-biryani'],
  ['2239792f-0be4-4e8b-81bb-f8a27544a899', 'chicken-biryani'],
  ['f7a344cd-30f0-4577-b145-8907f919d4d9', 'chicken-biryani'],
  ['9ff61cfc-9056-46bc-8224-9336f642f31a', 'chicken-biryani'],
  // soups-veg
  ['1c099bf1-27bc-49dc-b350-9e25f5a29109', 'soups-veg'],
  ['408682b9-5b8d-42d1-8330-3a40c7acf6eb', 'soups-veg'],
  ['43bbdfb3-49e5-4d22-ac69-41c79dc0dae2', 'soups-veg'],
  ['201125c3-19de-41f1-8834-a927f78d227b', 'soups-veg'],
  // soups-non-veg
  ['1a32c02c-545f-4438-a367-b490f10ac912', 'soups-non-veg'],
  ['2010db68-3451-48f3-a9f9-0441754c25fa', 'soups-non-veg'],
  ['19a9600c-d9c8-4fe0-b5f8-17cbd168341f', 'soups-non-veg'],
  // starters-veg
  ['4f9a7fd6-bd4e-4cca-8046-a5f8b0f692d6', 'starters-veg'],
  ['e784bf31-410e-4bc8-b2e5-7813db495fe2', 'starters-veg'],
  ['063377b3-0c19-4ec9-98bd-411aee79086e', 'starters-veg'],
  ['69871567-4cec-4251-9dc2-b90d66ee42f3', 'starters-veg'],
  ['374651c8-686f-4b51-bd98-8bdd21b655ca', 'starters-veg'],
  ['9782c38e-1f05-4e18-ad17-af7ef0ae21eb', 'starters-veg'],
  ['3082aa0c-1559-4d56-82ff-cbbd1da054f2', 'starters-veg'],
  // thandoori-kabab
  ['42e79095-7a66-4fa1-ae02-be8d0b154ecd', 'thandoori-kabab'],
  ['1bc548c2-f778-4240-aaba-da9d3d480793', 'thandoori-kabab'],
  ['b465169f-ce8f-4ec6-aa55-3d044fe28d8e', 'thandoori-kabab'],
  ['8b0a28e7-ccf7-4e32-a589-cec68dc819ea', 'thandoori-kabab'],
  ['30af8ccc-6269-47c4-b930-8cc0befe6f5f', 'thandoori-kabab'],
  // chicken-saters
  ['aa871537-f498-4571-844a-8e0cdfafaa32', 'chicken-saters'],
  ['b6f93876-9b85-4671-8bb8-81b80a0e3636', 'chicken-saters'],
  ['4e7bd4cf-81b4-4504-9922-94a83d80f78b', 'chicken-saters'],
  ['b7d94eed-d608-4060-85e1-3d41df93d4b9', 'chicken-saters'],
  ['3d2a8d9f-b35b-4b73-a736-1c75bf0bea9d', 'chicken-saters'],
  ['e7fa6e78-6452-4e5b-b1be-840cf8fb4857', 'chicken-saters'],
  // mutton-saters
  ['99155880-ff29-43ac-ad13-75a15e5f6ab1', 'mutton-saters'],
  ['85b1592a-1b97-49d6-957e-2577597e1974', 'mutton-saters'],
  // sea-starters
  ['bf63c907-1d14-440e-b2f9-8d6161d03faa', 'sea-starters'],
  ['5b4caa20-82bb-40ef-8caf-cf085065da3f', 'sea-starters'],
  ['09176895-c1a7-4268-b5b5-45c6826012f7', 'sea-starters'],
  ['5828f0e3-a49e-41f0-8053-fed1639eac55', 'sea-starters'],
  // pantry
  ['301eba72-9f75-4934-91b5-8b1826b00d8f', 'pantry'],
  ['2ef24da0-8fdd-4900-b3e7-336fd0a262b1', 'pantry'],
  ['cf676aec-f038-47a3-b320-791c34d88fbc', 'pantry'],
  ['6dbb1a2c-65ba-474d-be40-e930fd5c6e43', 'pantry'],
  ['9c0eeb8f-f01e-4e9f-9ec9-97c1f0df30bd', 'pantry'],
  ['ad9fc62a-1ba9-4ebf-9d8e-2f739fdc4305', 'pantry'],
  // others
  ['5e594bee-747d-45b0-ae3c-8dc848587703', 'others'],
  ['cd27fa9f-fc0c-433e-b67a-d4e8f589fc9a', 'others'],
  ['3ed9160b-7baf-4696-ab09-92eb5c951319', 'others'],
  ['259946d5-0bda-429d-bd6e-14cc71b54dc0', 'others'],
  ['dfc662ae-3c74-4f0b-b535-2dc88d140f7c', 'others'],
  ['d7ff6845-35d6-4de7-8d59-45b966d1a0c3', 'others'],
  ['e2bdf316-dd04-417c-919c-94f2fdf7dfa1', 'others'],
  ['77385873-60fc-4fbd-9c6f-64bf4abcd86f', 'others'],
  ['2cc63372-b0b9-4169-b6c8-773682c5223f', 'others'],
  ['9f7c6461-0f10-4846-99da-58fae58bbfd9', 'others'],
  ['6f8db3fe-fb70-45ff-be04-eba6ce855475', 'others'],
  ['a5a559bf-9434-4d03-ba89-c7b7b2410629', 'others'],
  ['adb8b3ab-8bc9-457d-a9df-8caa1e032f23', 'others'],
  // star-special
  ['59ba8178-4709-4636-b945-e12a3e8c62ca', 'star-special'],
];

// Build SQL
const categoryCounters = {};
const lines = [];

for (const [id, cat] of items) {
  if (!(cat in categoryCounters)) categoryCounters[cat] = 0;
  const pool = pools[cat];
  const photoId = pool[categoryCounters[cat] % pool.length];
  categoryCounters[cat]++;
  const ext = pngIds.has(photoId) ? 'png' : 'jpeg';
  const url = P(photoId, ext);
  lines.push(`  ('${id}'::uuid, '${url}'::text)`);
}

const sql = `WITH image_map(id, url) AS (VALUES
${lines.join(',\n')}
)
UPDATE menu_items mi
SET image_url = im.url
FROM image_map im
WHERE mi.id = im.id;`;

console.log(sql);
