import prismadb from '@/lib/prismadb';
import { getProductIndex, toAlgoliaRecord } from '@/lib/algolia';

/**
 * Re-index all products to ensure they have storeId and isArchived attributes.
 * This fixes the issue where filtered searches return 0 results.
 * 
 * The problem: Products were indexed before storeId/isArchived were added to the transformer.
 * Solution: Fetch all products with relations, transform them with the current transformer,
 *           and replace all objects in the Algolia index.
 * 
 * Run once: npx tsx scripts/fix-algolia-index.ts
 */

async function fixAlgoliaIndex() {
  const productIndex = getProductIndex();
  
  if (!productIndex) {
    console.error('❌ Algolia client not configured. Check ALGOLIA_APP_ID and ALGOLIA_ADMIN_API_KEY');
    process.exit(1);
  }

  try {
    console.log('🔍 Fetching all products with relations...');
    
    const products = await prismadb.product.findMany({
      include: {
        category: true,
        images: true,
        sizes: true,
        colors: true,
      },
    });

    console.log(`📦 Found ${products.length} products. Transforming...`);
    
    const records = products.map(toAlgoliaRecord);
    
    // Log first record to verify storeId and isArchived are present
    if (records.length > 0) {
      console.log('\n📋 Sample record (first product):');
      console.log(JSON.stringify(records[0], null, 2));
    }

    console.log('\n🚀 Replacing all objects in Algolia index...');
    await productIndex.replaceAllObjects(records, {
      autoGenerateObjectIDIfNotExist: false,
    });

    console.log(`✅ Successfully re-indexed ${products.length} products with storeId + isArchived`);
    console.log('\n📊 Next steps:');
    console.log('1. Open Algolia dashboard → products index');
    console.log('2. Click on "Wool Baseball Hat" (record #9)');
    console.log('3. Verify you see storeId and isArchived fields');
    console.log('4. Try searching from your frontend again\n');

  } catch (error) {
    console.error('❌ Re-indexing failed:', error);
    process.exit(1);
  }
}

fixAlgoliaIndex();
