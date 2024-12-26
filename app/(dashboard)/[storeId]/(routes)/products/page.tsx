import { Separator } from '@/components/ui/separator';
import { ProductList } from './components/list';
import { ApiList } from '@/components/ui/api-alert';

interface ProductsPageProps {
  params: Promise<{
    storeId: string;
  }>;
}

const ProductsPage = async ({ params }: ProductsPageProps) => {
  const { storeId } = await params;
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductList storeId={storeId} />
        <Separator className="my-4" />
        <ApiList entityName="products" entityIdName="productId" storeId={storeId} />
      </div>
    </div>
  );
};

export default ProductsPage;