import { BillboardForm } from "../components/form";

interface BillboardPageProps {
  params: Promise<{
    storeId: string;
    billboardId: string;
  }>;
}

export default async function BillboardPage({ params }: BillboardPageProps) {
  const { billboardId, storeId } = await params;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboardId} storeId={storeId} />
      </div>
    </div>
  );
}
