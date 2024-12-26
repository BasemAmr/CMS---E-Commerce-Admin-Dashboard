import  CategoryForm  from "../components/form";

interface CategoryPageProps {
  params: Promise<{
    storeId: string;
    categoryId: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId, storeId } = await params;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={categoryId} storeId={storeId} />
      </div>
    </div>
  );
}
