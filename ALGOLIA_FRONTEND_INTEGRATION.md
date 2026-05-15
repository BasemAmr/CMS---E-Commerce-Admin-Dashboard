# Algolia Search Integration Guide - Frontend Shop

## Quick Start

The CMS backend now syncs all product changes to Algolia in real-time. Your frontend shop can search products with <100ms latency using InstantSearch.

---

## 1. Install Dependencies

```bash
npm install algoliasearch react-instantsearch
# or
yarn add algoliasearch react-instantsearch
```

---

## 2. Create Search Config Hook

This hook fetches the secured search key from the CMS once, then uses it for all Algolia searches.

**`hooks/use-search-config.ts`**
```typescript
import { useQuery } from '@tanstack/react-query';

interface SearchConfig {
  appId: string;
  searchKey: string;
  indexName: string;
}

/**
 * Fetch Algolia search configuration from CMS.
 * The CMS generates a secured API key scoped to this storeId.
 * Key is cached indefinitely (rarely changes).
 */
export function useSearchConfig(storeId: string) {
  return useQuery({
    queryKey: ['search-config', storeId],
    queryFn: async () => {
      const res = await fetch(
        `/api/stores/${storeId}/search/key`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to load search config: ${error}`);
      }

      return res.json() as Promise<SearchConfig>;
    },
    staleTime: Infinity, // Key rarely changes; cache forever
    retry: 3, // Retry up to 3 times if network fails
  });
}
```

---

## 3. Create Search Page Component

**`components/search/algolia-search.tsx`**

```typescript
'use client';

import { useMemo } from 'react';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Configure,
  Pagination,
  Highlight,
  Stats,
} from 'react-instantsearch';
import { useSearchConfig } from '@/hooks/use-search-config';

/**
 * Individual product hit component.
 * Renders a product card with image, highlighted name, price, and category.
 */
function ProductHit({ hit }: { hit: any }) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      {hit.images?.[0] && (
        <img
          src={hit.images[0]}
          alt={hit.name}
          className="w-full h-48 object-cover bg-gray-100"
        />
      )}

      {/* Product Info */}
      <div className="p-4">
        {/* Name with search highlighting */}
        <h3 className="font-semibold text-sm mb-2">
          <Highlight attribute="name" hit={hit} />
        </h3>

        {/* Category badge */}
        <span className="inline-block bg-gray-100 text-xs px-2 py-1 rounded mb-2">
          {hit.category}
        </span>

        {/* Price */}
        <p className="text-lg font-bold text-green-600">${hit.price.toFixed(2)}</p>

        {/* Featured badge */}
        {hit.isFeatured && (
          <span className="inline-block mt-2 bg-yellow-100 text-xs px-2 py-1 rounded text-yellow-800">
            Featured
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Main search component.
 * Displays search box, filters, and product results from Algolia.
 */
export function AlgoliaSearch({ storeId }: { storeId: string }) {
  const { data: config, isLoading, error } = useSearchConfig(storeId);

  // Memoize searchClient to prevent unnecessary re-renders
  // Only recreate if appId or searchKey changes
  const searchClient = useMemo(() => {
    if (!config) return null;
    return algoliasearch(config.appId, config.searchKey);
  }, [config?.appId, config?.searchKey]);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-96 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg" />
    );
  }

  // Error state
  if (error || !searchClient || !config) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-semibold">Search Unavailable</p>
        <p className="text-sm">
          {error instanceof Error ? error.message : 'Unable to load search configuration'}
        </p>
      </div>
    );
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={config.indexName}
      initialUiState={{
        [config.indexName]: {
          query: '',
          page: 0,
        },
      }}
    >
      {/* Hidden: Tenant isolation already baked into secured key, but double-filter for safety */}
      <Configure
        filters={`storeId:${storeId} AND isArchived:false`}
        hitsPerPage={12}
      />

      <div className="max-w-7xl mx-auto">
        {/* Search Box */}
        <div className="mb-8">
          <SearchBox
            placeholder="Search products (name, color, size, category)..."
            classNames={{
              root: 'w-full',
              input:
                'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              submitIcon: 'hidden',
              resetIcon: 'hidden',
            }}
          />
        </div>

        <div className="flex gap-8">
          {/* Sidebar: Faceted Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h4 className="font-semibold text-lg mb-3">Category</h4>
                <RefinementList
                  attribute="category"
                  classNames={{
                    root: 'space-y-2',
                    label: 'flex items-center gap-2 cursor-pointer',
                    checkbox: 'w-4 h-4',
                  }}
                />
              </div>

              {/* Size Filter */}
              <div>
                <h4 className="font-semibold text-lg mb-3">Size</h4>
                <RefinementList
                  attribute="sizes"
                  classNames={{
                    root: 'space-y-2',
                    label: 'flex items-center gap-2 cursor-pointer',
                    checkbox: 'w-4 h-4',
                  }}
                />
              </div>

              {/* Color Filter */}
              <div>
                <h4 className="font-semibold text-lg mb-3">Color</h4>
                <RefinementList
                  attribute="colors"
                  classNames={{
                    root: 'space-y-2',
                    label: 'flex items-center gap-2 cursor-pointer',
                    checkbox: 'w-4 h-4',
                  }}
                />
              </div>

              {/* Featured Filter */}
              <div>
                <h4 className="font-semibold text-lg mb-3">Special</h4>
                <RefinementList
                  attribute="isFeatured"
                  classNames={{
                    root: 'space-y-2',
                    label: 'flex items-center gap-2 cursor-pointer',
                    checkbox: 'w-4 h-4',
                  }}
                />
              </div>
            </div>
          </aside>

          {/* Main: Search Results */}
          <main className="flex-1">
            {/* Search Stats */}
            <div className="mb-6 text-sm text-gray-600">
              <Stats />
            </div>

            {/* Product Grid */}
            <Hits
              hitComponent={ProductHit}
              classNames={{
                root: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
              }}
            />

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <Pagination
                classNames={{
                  root: 'flex gap-2',
                  item: 'px-3 py-2 border rounded hover:bg-gray-100',
                  disabledItem: 'opacity-50 cursor-not-allowed',
                  selectedItem: 'bg-blue-500 text-white border-blue-500',
                }}
              />
            </div>
          </main>
        </div>
      </div>
    </InstantSearch>
  );
}
```

---

## 4. Usage in Your Shop Page

**Example: `app/store/[storeId]/search/page.tsx`**

```typescript
import { AlgoliaSearch } from '@/components/search/algolia-search';

export default function SearchPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  // Get storeId from route params
  const { storeId } = React.use(params);

  return (
    <div className="min-h-screen bg-white">
      <div className="py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Search Products</h1>
        <AlgoliaSearch storeId={storeId} />
      </div>
    </div>
  );
}
```

---

## 5. Alternative: Minimal Autocomplete

For a quick autocomplete in a header search box:

**`components/search/autocomplete-mini.tsx`**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { useSearchConfig } from '@/hooks/use-search-config';

export function AutocompleteMini({ storeId }: { storeId: string }) {
  const { data: config } = useSearchConfig(storeId);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!config || query.length < 2) {
      setResults([]);
      return;
    }

    const searchClient = algoliasearch(config.appId, config.searchKey);
    const index = searchClient.initIndex(config.indexName);

    index
      .search(query, {
        facetFilters: [`storeId:${storeId}`, `isArchived:false`],
        hitsPerPage: 5,
      })
      .then(({ results: hits }) => {
        setResults(hits[0]?.hits || []);
        setIsOpen(true);
      })
      .catch(console.error);
  }, [query, config, storeId]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full px-4 py-2 border rounded-lg"
      />

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-t-0 rounded-b-lg shadow-lg z-10">
          {results.map((hit) => (
            <div
              key={hit.objectID}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
            >
              {hit.images?.[0] && (
                <img
                  src={hit.images[0]}
                  alt={hit.name}
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium text-sm">{hit.name}</p>
                <p className="text-xs text-gray-500">${hit.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 6. Key Points

| Feature | Details |
|---------|---------|
| **Latency** | <100ms for most queries (Algolia CDN) |
| **Typo Tolerance** | "red shrt" matches "red shirt" automatically |
| **Faceting** | Filter by category, size, color instantly |
| **Highlighting** | Matched terms highlighted in search results |
| **Tenant Isolation** | Secured API key restricts searches to this storeId only |
| **Real-Time Sync** | Products updated in CMS appear in search within milliseconds |

---

## 7. Environment Variables (Frontend)

No frontend env vars needed—the search configuration is fetched from the CMS endpoint (`/api/stores/[storeId]/search/key`).

---

## 8. Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Search Unavailable" error** | CMS endpoint not configured; check ALGOLIA_* env vars on backend |
| **No results appearing** | Verify products exist in CMS; check store ownership |
| **Slow search** | Check network tab; Algolia queries should be <100ms |
| **Filters not working** | Ensure React Query is set up correctly in shop app |

---

## 9. Demo Flow

1. **Open shop** → `/store/[storeId]/search` page
2. **Type product name** → See results in real-time
3. **Click category filter** → Results refine instantly
4. **Go to CMS dashboard** → Edit/create/delete a product
5. **Return to shop** → New product appears in search within seconds

---

**That's it!** Your frontend shop now has production-grade search powered by Algolia.
