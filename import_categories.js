const { createClient } = require('@sanity/client');
const { v4: uuidv4 } = require('uuid');

const client = createClient({
  projectId: 'e4jrvr61',
  dataset: 'production',
  apiVersion: '2024-03-01',
  useCdn: false,
  token: 'sk8GIeBH2MhXiis6gVkQ0oBBKkgl9T00hcrF2J4tcUp1z3sxdYoY4TdNI3aoVmoQlsgznX4QLdlmKlVK2Z34nPedZPz81Fy5m1bT2uvcpLnJLgGdHhSBbMPcqiMRFmZrfM4IBOVcUiif78RzVpeegZyKyFsEVRJ2k4cNB8ciEIYdNb4dT389'
});

const categories = [
  { _id: 'cat-oil', _type: 'category', name: 'Oil Filters', slug: { _type: 'slug', current: 'oil-filters' }, description: 'Premium oil filters for maximum engine protection.', order: 1 },
  { _id: 'cat-air', _type: 'category', name: 'Air Filters', slug: { _type: 'slug', current: 'air-filters' }, description: 'High-flow air filters to keep your engine breathing clean.', order: 2 },
  { _id: 'cat-fuel', _type: 'category', name: 'Fuel Filters', slug: { _type: 'slug', current: 'fuel-filters' }, description: 'Advanced fuel filtration and water separators.', order: 3 },
  { _id: 'cat-cabin', _type: 'category', name: 'Cabin Filters', slug: { _type: 'slug', current: 'cabin-filters' }, description: 'Clean air for the cab interior.', order: 4 },
  { _id: 'cat-other', _type: 'category', name: 'Accessories & Kits', slug: { _type: 'slug', current: 'accessories-kits' }, description: 'Filter change kits, lamps, and other truck accessories.', order: 5 }
];

async function run() {
  console.log('Creating categories...');
  for (const cat of categories) {
    await client.createOrReplace(cat);
  }
  console.log('Categories created!');

  console.log('Fetching products...');
  const products = await client.fetch('*[_type == "product"]{_id, name}');
  
  let tx = client.transaction();
  let count = 0;
  
  for (const p of products) {
    const nameLower = p.name.toLowerCase();
    let catId = 'cat-other';
    
    if (nameLower.includes('oil')) catId = 'cat-oil';
    else if (nameLower.includes('air')) catId = 'cat-air';
    else if (nameLower.includes('fuel') || nameLower.includes('separator')) catId = 'cat-fuel';
    else if (nameLower.includes('cabin')) catId = 'cat-cabin';
    
    tx.patch(p._id, p => p.set({ category: { _type: 'reference', _ref: catId } }));
    count++;
    
    if (count > 0 && count % 50 === 0) {
        await tx.commit();
        console.log(`Committed ${count} products...`);
        tx = client.transaction();
    }
  }
  
  if (count % 50 !== 0) {
      await tx.commit();
      console.log(`Committed final batch. Total products categorized: ${count}`);
  }
}

run().catch(console.error);
