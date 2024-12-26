import { ProductForm } from "./form";
import { useCategories } from "@/hooks/api/use-category";
import { useSizes } from "@/hooks/api/use-size";
import { useColors } from "@/hooks/api/use-color";


const ClientProductPage = (
    {productId, storeId}: {
        productId: string;
        storeId: string;
    }
) => {

    const {data: categories} = useCategories(storeId);
    const {data: sizes} = useSizes(storeId);
    const {data: colors} = useColors(storeId);

    return (
        <ProductForm 
          initialData={productId} 
          storeId={storeId} 
          categories={categories} 
          sizes={sizes} 
          colors={colors} 
        />
    );
}

export default ClientProductPage;