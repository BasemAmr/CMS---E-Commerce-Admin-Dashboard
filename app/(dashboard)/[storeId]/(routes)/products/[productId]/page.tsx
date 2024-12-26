import { Separator } from "@/components/ui/separator";
import ClientProductPage from "../components/client";

interface ProductPageProps {
  params: Promise<{
    productId: string;
    storeId: string;
  }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId, storeId } = await params;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ClientProductPage productId={productId} storeId={storeId} />
        <Separator />
      </div>
    </div>
  );
};

export default ProductPage;
