#!/usr/bin/env node

/**
 * Algolia Seed via API - Using algoliasearch client
 * 
 * Run: npx tsx scripts/seed-algolia-simple.ts <storeId>
 */

import * as dotenv from 'dotenv';
import path from 'path';
import algoliasearch from 'algoliasearch';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY;

async function seedViaApi() {
  try {
    console.log('🚀 Starting Algolia seed...\n');

    // Validate Algolia credentials
    if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY) {
      console.error('❌ Algolia credentials not found');
      process.exit(1);
    }

    console.log('✅ Algolia credentials loaded');

    const storeId = process.argv[2];
    if (!storeId) {
      console.error('❌ Store ID required');
      console.log('\nUsage: npx tsx scripts/seed-algolia-simple.ts <storeId>');
      process.exit(1);
    }

    // Fetch products from CMS API
    console.log(`📦 Fetching products for store: ${storeId}\n`);

    const productsResponse = await fetch(
      `http://localhost:3000/api/stores/${storeId}/products`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!productsResponse.ok) {
      console.error(`❌ Failed to fetch products (${productsResponse.status})`);
      console.log('Is the dev server running? npm run dev');
      process.exit(1);
    }

    const products = (await productsResponse.json()) as any[];
    console.log(`✅ Found ${products.length} products`);

    if (products.length === 0) {
      console.log('⚠️ No products found.');
      process.exit(0);
    }

    // Transform products
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

    // Initialize Algolia client and upload
    console.log(`📤 Uploading ${records.length} products to Algolia...\n`);

    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);
    const index = client.initIndex('products');

    await index.saveObjects(records);

    console.log(`✨ Success! Indexed ${records.length} products to Algolia\n`);
    console.log('🔍 Next steps:');
    console.log('   1. Go to https://www.algolia.com/apps');
    console.log('   2. Select your app → Indices → "products"');
    console.log(`   3. You should see ${records.length} products indexed\n`);
    console.log('💡 New products in the CMS will sync automatically.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

seedViaApi();
