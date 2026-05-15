/**
 * scripts/configure-algolia-index.ts
 *
 * Applies the correct index settings to Algolia.
 * Run ONCE after re-indexing your products.
 *
 * WHY THIS IS NEEDED
 * ------------------
 * Your current Algolia settings have `isArchived` in searchableAttributes.
 * Boolean fields are not text — they should never be searchable.
 * They need to be `filterOnly(isArchived)` in attributesForFaceting so that
 * the secured key's embedded filter `isArchived:false` works correctly.
 *
 * `storeId` also needs to be `filterOnly` in attributesForFaceting so the
 * `storeId:X` part of the secured key filter works.
 *
 * Usage:
 *   npx tsx scripts/configure-algolia-index.ts
 */

import algoliasearch from 'algoliasearch';

async function main() {
  const appId = process.env.ALGOLIA_APP_ID;
  const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;

  if (!appId || !adminKey) {
    throw new Error('Missing ALGOLIA_APP_ID or ALGOLIA_ADMIN_API_KEY');
  }

  const client = algoliasearch(appId, adminKey);
  const index = client.initIndex('products');

  console.log('🔧 Applying index settings...');

  await index.setSettings({
    // ── Searchable attributes ──────────────────────────────────────────────
    // Only text attributes that users actually type to find products.
    // ORDER MATTERS: Algolia ranks earlier attributes higher.
    // isArchived, storeId, isFeatured, categoryId, images, createdAt removed
    // because they are not text the user would type.
    searchableAttributes: [
      'name',         // highest relevance — product name
      'category',     // users type "shoes", "bags"
      'colors',       // users type "black", "red"
      'sizes',        // users type "L", "XL", "Large"
    ],

    // ── Faceting (filtering + refinement lists) ────────────────────────────
    // `filterOnly` means: available for filtering/secured-key filters,
    // but NOT retrieved in the facet count response (saves bandwidth).
    // Regular facets (category, sizes, colors) are needed by RefinementList widgets.
    attributesForFaceting: [
      'filterOnly(storeId)',    // required by secured API key filter
      'filterOnly(isArchived)', // required by secured API key filter
      'filterOnly(isFeatured)', // useful for featured-only pages
      'category',               // RefinementList widget
      'sizes',                  // RefinementList widget
      'colors',                 // RefinementList widget
    ],

    // ── Custom ranking ─────────────────────────────────────────────────────
    // Featured products rise to the top; newest products next.
    customRanking: [
      'desc(isFeatured)',
      'desc(createdAt)',
    ],

    // ── Highlight tags ─────────────────────────────────────────────────────
    // react-instantsearch's <Highlight> component uses these tags.
    highlightPreTag: '<mark>',
    highlightPostTag: '</mark>',

    // ── Pagination ─────────────────────────────────────────────────────────
    hitsPerPage: 12,

    // ── Typo tolerance ─────────────────────────────────────────────────────
    typoTolerance: 'min', // allow 1 typo; 'strict' for 0, true for adaptive
  });

  console.log('✅ Index settings applied successfully.');
  console.log('');
  console.log('📋 NEXT STEPS:');
  console.log('1. Go to Algolia dashboard → your index → Browse → Edit Preview Attributes');
  console.log('   Set Title  = name');
  console.log('   Set Images = images');
  console.log('   This fixes the "false" label in the Algolia UI demo.');
  console.log('');
  console.log('2. Run the reindex script to stamp storeId onto all products:');
  console.log('   npx tsx scripts/reindex-all-products.ts');
  console.log('');
}

main().catch((err) => {
  console.error('[CONFIGURE ERROR]', err);
  process.exit(1);
});
