import { Separator } from '@/components/ui/separator';
import ProductClient from './components/client';
import { ApiList } from '@/components/ui/api-alert';

interface ProductsPageProps {
    params: Promise<{
        storeId: string;
    }>;
}

async function fetchProducts(storeId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_STORE_URL}/api/stores/${storeId}/products`, {
        next: {
            tags: ['products']
        },
        cache: 'force-cache'
    });
    return res.json();
}

const ProductsPage = async ({ params }: ProductsPageProps) => {
    const { storeId } = await params;
    console.time('ProductsPage');
    const products = await fetchProducts(storeId) || [];
    console.timeEnd('ProductsPage');
    
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="space-y-4">
                    <ProductClient products={products} storeId={storeId} />
                </div>
                <Separator className="my-4" />
                <div className="space-y-4"></div>
                    <h3 className="text-xl font-semibold">API Integration</h3>
                    <ApiList 
                        entityName="stores/{storeId}/products"
                        entityIdName="productId"
                    />
                </div>
            </div>
    );
};

export default ProductsPage;
