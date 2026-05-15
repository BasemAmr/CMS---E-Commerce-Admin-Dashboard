#!/usr/bin/env node

/**
 * Algolia Seed via API
 * 
 * Instead of connecting to the database directly (which may have connection issues),
 * this script uses the existing CMS API to fetch and index products.
 * 
 * Run: npx ts-node scripts/seed-algolia-via-api.ts
 */

import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY;

async function seedViaApi() {
  try {
    console.log('🚀 Starting Algolia seed via API...\n');

    // Validate Algolia credentials
    if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY) {
      console.error('❌ Algolia credentials not found. Check ALGOLIA_APP_ID and ALGOLIA_ADMIN_API_KEY in .env');
      process.exit(1);
    }

    console.log('✅ Algolia credentials loaded\n');

    // Note: This script requires you to have store IDs.
    // For now, we'll use a hardcoded example or require it as an argument.
    const storeId = process.argv[2];

    if (!storeId) {
      console.error('❌ Store ID required');
      console.log('\nUsage: npx ts-node scripts/seed-algolia-via-api.ts <storeId>');
      console.log('\nExample: npx ts-node scripts/seed-algolia-via-api.ts 550e8400-e29b-41d4-a716-446655440000');
      process.exit(1);
    }

    console.log(`📦 Fetching products for store: ${storeId}\n`);

    // Fetch products from the CMS API
    const productsResponse = await fetch(
      `http://localhost:3000/api/stores/${storeId}/products`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!productsResponse.ok) {
      console.error(`❌ Failed to fetch products (${productsResponse.status})`);
      console.log('   Is the dev server running? Start it with: npm run dev');
      process.exit(1);
    }

    const products = (await productsResponse.json()) as any[];
    console.log(`✅ Found ${products.length} products\n`);

    if (products.length === 0) {
      console.log('⚠️  No products found. Create products in the CMS first.');
      process.exit(0);
    }

    // Transform products to Algolia format
    console.log('🔄 Transforming records...');
    const records = products.map((product: any) => ({
      objectID: product.id,
      storeId: product.storeId,
      name: product.name,
      price: product.price,
      category: product.category?.name || 'Uncategorized',
      categoryId: product.categoryId,
      sizes: product.sizes?.map((s: any) => s.name) || [],
      colors: product.colors?.map((c: any) => c.name) || [],
      images: product.images?.map((img: any) => img.url) || [],
      isFeatured: product.isFeatured || false,
      isArchived: product.isArchived || false,
      createdAt: new Date(product.createdAt).getTime(),
    }));

    // Bulk upload to Algolia using REST API
    console.log(`📤 Uploading ${records.length} products to Algolia...\n`);

    const algoliaUrl = `https://${ALGOLIA_APP_ID}.api.algolia.net/1/indexes/products/batch`;

    const batchRequests = records.map((record: any) => ({
      action: 'updateObject',
      body: record,
    }));

    const response = await fetch(algoliaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Algolia-API-Key': ALGOLIA_ADMIN_API_KEY,
        'X-Algolia-Application-Id': ALGOLIA_APP_ID,
      },
      body: JSON.stringify({ requests: batchRequests }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Algolia upload failed (${response.status}):`);
      console.error(error);
      process.exit(1);
    }

    console.log(`✨ Success! Indexed ${records.length} products to Algolia`);
    console.log('');
    console.log('📊 Next steps:');
    console.log('   1. Visit https://www.algolia.com/apps');
    console.log('   2. Go to your app → Indices → "products"');
    console.log('   3. You should see all products indexed');
    console.log('');
    console.log('💡 New products created in the CMS will now sync automatically.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedViaApi();
