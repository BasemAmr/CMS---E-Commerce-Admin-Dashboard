#!/usr/bin/env node

/**
 * Seed Script: Bulk index existing products to Algolia
 * 
 * Run this ONCE after setting up Algolia credentials:
 * npx ts-node scripts/seed-algolia.ts
 * 
 * This reads all products from PostgreSQL and uploads them to Algolia.
 * All subsequent product changes are synced automatically via API routes.
 */

import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local first (takes precedence), then .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import prismadb from '../lib/prismadb';
import { getProductIndex, toAlgoliaRecord } from '../lib/algolia';

async function seedAlgolia() {
  try {
    console.log('🚀 Starting Algolia seed...');

    // Get the index at runtime (after env vars are loaded)
    const productIndex = getProductIndex();

    if (!productIndex) {
      console.error('❌ Algolia not configured. Set ALGOLIA_* environment variables.');
      process.exit(1);
    }

    // Fetch all products with relationships
    console.log('📦 Fetching products from PostgreSQL...');
    const products = await prismadb.product.findMany({
      include: {
        category: true,
        images: true,
        sizes: true,
        colors: true,
      },
    });

    if (products.length === 0) {
      console.log('⚠️  No products found. Create products in the CMS first, then run this script again.');
      process.exit(0);
    }

    console.log(`✅ Found ${products.length} products`);

    // Transform to Algolia format
    console.log('🔄 Transforming records...');
    const records = products.map(toAlgoliaRecord);

    // Bulk upload to Algolia (replaces all existing records)
    console.log('📤 Uploading to Algolia...');
    await productIndex.replaceAllObjects(records);

    console.log(`✨ Success! Indexed ${records.length} products to Algolia`);
    console.log('🔍 Visit your Algolia dashboard to see the indexed data');
    console.log('');
    console.log('💡 Tip: New products created in the CMS will now sync automatically.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedAlgolia();
