import { Separator } from "@/components/ui/separator";
import {BillboardList} from "./components/list";
import { ApiList } from "@/components/ui/api-alert";

interface BillboardProps {
  params: Promise<{
    storeId: string;
  }>;
}

const BillboardsPage = async ({ params }: BillboardProps) => {
  const { storeId } = await params;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardList storeId={storeId} />
        <Separator className="my-4" />
        <ApiList entityName="billboards" entityIdName="billboardId" storeId={storeId} />
      </div>
    </div>
  );
};

export default BillboardsPage;
