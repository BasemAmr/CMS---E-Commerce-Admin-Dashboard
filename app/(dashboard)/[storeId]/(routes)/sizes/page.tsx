import { Separator } from "@/components/ui/separator";
import { SizeList } from "./components/list";
import { ApiList } from "@/components/ui/api-alert";

interface SizeProps {
  params: Promise<{
    storeId: string;
  }>;
}

const SizesPage = async ({ params }: SizeProps) => {
  const { storeId } = await params;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeList storeId={storeId} />
        <Separator className="my-4" />
        <ApiList entityName="sizes" entityIdName="sizeId" storeId={storeId} />
      </div>
    </div>
  );
};

export default SizesPage;