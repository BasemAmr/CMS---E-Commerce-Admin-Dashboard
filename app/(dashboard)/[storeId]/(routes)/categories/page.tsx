import { Separator } from "@/components/ui/separator";
import {CategoryList} from "./components/list";
import { ApiList } from "@/components/ui/api-alert";

interface CategoryPageProps {
  params: Promise<{
    storeId: string;
  }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { storeId } = await params;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryList storeId={storeId} />
        <Separator className="my-4" />
        <ApiList entityName="categories" entityIdName="categoryId" storeId={storeId} />
      </div>
    </div>
  );
};

export default CategoryPage;
