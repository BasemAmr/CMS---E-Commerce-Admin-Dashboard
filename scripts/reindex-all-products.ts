/**
 * scripts/reindex-all-products.ts
 *
 * One-time script to re-sync every product in the DB to Algolia.
 * Run this once after applying index settings.
 *
 * Usage:
 *   npx tsx scripts/reindex-all-products.ts
 *
 * WHY THIS IS NEEDED
 * ------------------
 * Your secured API key embeds the filter `storeId:<id> AND isArchived:false`.
 * Algolia cannot filter on attributes that are missing from a record — if a record
 * has no `storeId` field, the filter excludes it and returns 0 hits.
 *
 * The current records in the `products` index were indexed before `storeId` was
 * added to `toAlgoliaRecord()`. Re-indexing stamps every record with `storeId`
 * so the secured key filter works.
 */

import prismadb from '@/lib/prismadb';
import { getProductIndex, toAlgoliaRecord } from '@/lib/algolia';

async function main() {
  const productIndex = getProductIndex();

  if (!productIndex) {
    throw new Error(
      'Algolia not configured. Check ALGOLIA_APP_ID and ALGOLIA_ADMIN_API_KEY env vars'
    );
  }

  console.log('📦 Fetching all products from database...');

  const products = await prismadb.product.findMany({
    include: {
      category: true,
      images: true,
      // NOTE: Your Prisma schema uses implicit many-to-many junction tables.
      // If the includes below don't work, check your actual schema to see
      // how colors and sizes are related to Product.
      colors: true,
      sizes: true,
    },
  });

  console.log(`✓ Found ${products.length} products. Starting Algolia sync...`);

  // Map products to Algolia record format using the same transformer from lib/algolia
  const algoliaRecords = products.map(toAlgoliaRecord);

  // Verify storeId is present — fail loudly before sending bad data
  const missingStoreId = algoliaRecords.filter((r) => !r.storeId);
  if (missingStoreId.length > 0) {
    console.error(
      `\n❌ [ERROR] ${missingStoreId.length} records are missing storeId.`
    );
    console.error('Check toAlgoliaRecord() in lib/algolia.ts and your Prisma query includes.');
    console.error('Affected objectIDs:', missingStoreId.map((r) => r.objectID));
    process.exit(1);
  }

  console.log('✓ All records have storeId. Uploading to Algolia...\n');

  // replaceAllObjects deletes all existing records and adds new ones atomically
  const result = await productIndex.replaceAllObjects(algoliaRecords, {
    autoGenerateObjectIDIfNotExist: false,
  });

  console.log(`✅ Indexed ${algoliaRecords.length} products.`);
  console.log(`   Task IDs: ${result.taskIDs.join(', ')}`);

  // Wait for all indexing to complete before exiting
  if (result.taskIDs.length > 0) {
    await productIndex.waitTask(result.taskIDs[result.taskIDs.length - 1]);
    console.log('✅ All indexing tasks complete. Algolia index is now up to date.\n');
  }

  console.log('🎉 SUCCESS! Your Algolia index is ready for search.');
  console.log('');
  console.log('📋 VERIFICATION:');
  console.log('1. Go to Algolia dashboard → products index → Browse');
  console.log('2. Click on any product and verify:');
  console.log('   - storeId field is present and correct');
  console.log('   - isArchived field is present');
  console.log('3. Try a search query from your frontend shop');
  console.log('   - Should return hits instead of nbHits: 0\n');
}

main().catch((err) => {
  console.error('[REINDEX ERROR]', err);
  process.exit(1);
});
