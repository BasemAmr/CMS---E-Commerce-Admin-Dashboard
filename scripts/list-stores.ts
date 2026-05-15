#!/usr/bin/env node

/**
 * List Stores
 * 
 * Shows all your stores so you can pick the storeId to seed.
 * 
 * Run: npx ts-node scripts/list-stores.ts
 */

import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function listStores() {
  try {
    console.log('📦 Fetching stores...\n');

    const response = await fetch('http://localhost:3000/api/stores', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      console.error('❌ Failed to fetch stores');
      console.log('Is the dev server running? npx run dev');
      process.exit(1);
    }

    const stores = (await response.json()) as any[];

    if (stores.length === 0) {
      console.log('No stores found. Create one in the CMS first.');
      process.exit(0);
    }

    console.log(`Found ${stores.length} store(s):\n`);
    stores.forEach((store, idx) => {
      console.log(`${idx + 1}. ${store.name}`);
      console.log(`   ID: ${store.id}`);
      console.log('');
    });

    console.log('To seed a store to Algolia, run:');
    console.log('   npx ts-node scripts/seed-algolia-via-api.ts <storeId>\n');
    console.log('Example:');
    if (stores.length > 0) {
      console.log(`   npx ts-node scripts/seed-algolia-via-api.ts ${stores[0].id}\n`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listStores();
