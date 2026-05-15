import algoliasearch from 'algoliasearch';

// Initialize Algolia client lazily to ensure env vars are loaded
// This function is called at runtime, not at module import time
function getAlgoliaClient() {
  const appId = process.env.ALGOLIA_APP_ID;
  const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;

  if (!appId || !adminKey) {
    return null;
  }

  return algoliasearch(appId, adminKey);
}

function getProductIndex() {
  const client = getAlgoliaClient();
  return client ? client.initIndex('products') : null;
}

// Export getter functions instead of static instances
export { getAlgoliaClient, getProductIndex };

// For backward compatibility, export static versions (used in API routes)
export const algoliaClient = getAlgoliaClient();
export const productIndex = getProductIndex();

/**
 * Transform a Prisma product record to Algolia search format.
 * Algolia will tokenize and index searchable attributes (name, category, colors, sizes),
 * and make other fields available for filtering, sorting, and display.
 */
export function toAlgoliaRecord(product: any) {
  return {
    objectID: product.id,
    storeId: product.storeId,
    name: product.name,
    price: product.price,
    category: product.category?.name || 'Uncategorized',
    categoryId: product.categoryId,
    // Arrays for faceted search (color/size filtering in shop frontend)
    sizes: product.sizes?.map((s: any) => s.name) || [],
    colors: product.colors?.map((c: any) => c.name) || [],
    // Image URLs for product preview in search results
    images: product.images?.map((img: any) => img.url) || [],
    // Ranking boosts for featured products
    isFeatured: product.isFeatured,
    // Visibility flag: archived products filtered out by default in frontend
    isArchived: product.isArchived,
    // Unix timestamp for sorting by newness
    createdAt: product.createdAt.getTime(),
  };
}

/**
 * Sync a product to Algolia after a database mutation.
 * Non-blocking: errors logged but don't fail the API response.
 * This allows the CMS to remain responsive even if Algolia is temporarily slow.
 */
export async function syncProductToAlgolia(product: any) {
  if (!productIndex) {
    console.warn('[ALGOLIA] Client not configured; skipping sync');
    return;
  }

  try {
    await productIndex.saveObject(toAlgoliaRecord(product));
  } catch (error) {
    // Log but don't throw: CMS should not fail if Algolia is temporarily down.
    // In production, send to error tracking service (Sentry, etc.)
    console.error('[ALGOLIA_SYNC_ERROR]', error);
  }
}

/**
 * Delete a product from Algolia after database deletion.
 */
export async function deleteProductFromAlgolia(productId: string) {
  if (!productIndex) {
    console.warn('[ALGOLIA] Client not configured; skipping delete');
    return;
  }

  try {
    await productIndex.deleteObject(productId);
  } catch (error) {
    console.error('[ALGOLIA_DELETE_ERROR]', error);
  }
}
