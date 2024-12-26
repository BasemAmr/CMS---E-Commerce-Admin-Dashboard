import { SizeForm } from "../components/form";

interface SizePageProps {
  params: Promise<{
    storeId: string;
    sizeId: string;
  }>;
}

export default async function SizePage({ params }: SizePageProps) {
  const { sizeId, storeId } = await params;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={sizeId} storeId={storeId} />
      </div>
    </div>
  );
}