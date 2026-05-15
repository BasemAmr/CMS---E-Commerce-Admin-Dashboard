import { NextRequest, NextResponse } from 'next/server';
import { algoliaClient } from '@/lib/algolia';

/**
 * Generate a secured Algolia search API key scoped to a specific store.
 * 
 * This endpoint is PUBLIC (no auth required) because:
 * 1. The search key is scoped to this storeId only (multi-tenant isolation)
 * 2. The key is read-only (can't modify data)
 * 3. Filters ensure archived products are hidden
 * 4. The storeId is already public in the URL
 * 
 * The frontend shop calls this once to get search credentials,
 * then talks directly to Algolia (not through CMS) for all searches.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    // If Algolia is not configured, return error
    if (!algoliaClient) {
      return new NextResponse(
        JSON.stringify({
          error: 'Search not configured. Set ALGOLIA_* environment variables.',
        }),
        { status: 503 }
      );
    }

    const baseSearchKey = process.env.ALGOLIA_SEARCH_API_KEY;
    if (!baseSearchKey) {
      console.error('[ALGOLIA] ALGOLIA_SEARCH_API_KEY not configured');
      return new NextResponse(
        JSON.stringify({
          error: 'Search API key not configured on server',
        }),
        { status: 503 }
      );
    }

    // Generate a secured API key that:
    // 1. Restricts searches to only products from this store
    // 2. Hides archived products from search results
    // 3. Can be used indefinitely or with expiration (optional)
    const securedKey = algoliaClient.generateSecuredApiKey(baseSearchKey, {
      // Restrict searches to only products from this store that are not archived
      filters: `storeId:${storeId} AND isArchived:false`,
    });

    return NextResponse.json(
      {
        appId: process.env.ALGOLIA_APP_ID,
        searchKey: securedKey,
        indexName: 'products',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[SEARCH_KEY_ERROR]', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to generate search key',
      }),
      { status: 500 }
    );
  }
}
