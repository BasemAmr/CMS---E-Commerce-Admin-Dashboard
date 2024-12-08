import { Separator } from '@/components/ui/separator';
import BillboardClient from './components/categories-client';
import { ApiList } from '@/components/ui/api-alert';
import prismadb from '@/lib/prismadb';

interface CategoriesFormProps {
    params: {
        storeId: string;
    };
}

const CategoriesPage = async ({ params }: CategoriesFormProps) => {
    const { storeId } = await params;
    const categories = await prismadb.category.findMany({
        where: {
            storeId
        },
        include: {
            billboards: true
        },
        orderBy: {
            createdAt: 'desc'
        }

    });
    
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
