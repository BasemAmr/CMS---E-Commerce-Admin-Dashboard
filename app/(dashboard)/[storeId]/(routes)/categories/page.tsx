import { Separator } from '@/components/ui/separator';
import BillboardClient from './components/categories-client';
import { ApiList } from '@/components/ui/api-alert';

interface CategoriesFormProps {
    params: Promise<{
        storeId: string;
    }>;
}
const fetchCategories = async (storeId: string) => {
    console.time('fetchCategories');
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_STORE_URL}/api/stores/${storeId}/categories`, {
        next: { tags: ['categories'] },
        cache: 'force-cache'
    });
    const categories = await response.json();
    console.timeEnd('fetchCategories');
    return categories;
};

const CategoriesPage = async ({ params }: CategoriesFormProps) => {
    const { storeId } = await params;
    const categories = await fetchCategories(storeId);
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="space-y-4">
                    <BillboardClient categories={categories} storeId={storeId} />
                </div>
                <Separator className="my-4" />
                <div className="space-y-4"></div>
                    <h3 className="text-xl font-semibold">API Integration</h3>
                    <ApiList 
                        entityName="stores/{storeId}/categories"
                        entityIdName="categoryId"
                    />
                </div>
            </div>
    );
};

export default CategoriesPage;
