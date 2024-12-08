import { Separator } from '@/components/ui/separator';
import ProductClient from './components/client';
import { ApiList } from '@/components/ui/api-alert';
import prismadb from '@/lib/prismadb';

interface ProductsPageProps {
    params: {
        storeId: string;
    };
}

const ProductsPage = async ({ params }: ProductsPageProps) => {
    const { storeId } = await params;
    const products = await prismadb.product.findMany({
        where: {
            storeId
        },
        include : {
            category: true,
            size : true,
            color: true
        }
    });
    
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
