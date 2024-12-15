import { Separator } from '@/components/ui/separator';
import { ApiList } from '@/components/ui/api-alert';
import prismadb from '@/lib/prismadb';
import SizeClient from './components/client';

interface SizesProps {
    params: Promise<{
        storeId: string;
    }>;
}

async function fetchSizes(storeId: string) {
    console.time('Fetch Sizes Query');
    const sizes = await prismadb.size.findMany({
        where: {
            storeId
        }
    });
    console.timeEnd('Fetch Sizes Query');
    return sizes;
}

const SizesPage = async ({ params }: SizesProps) => {
    console.time('Total Page Load');
    const { storeId } = await params;
    const sizes = await fetchSizes(storeId) || [];
    console.timeEnd('Total Page Load');
    
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="space-y-4">
                    <SizeClient sizes={sizes} storeId={storeId} />
                </div>
                <Separator className="my-4" />
                <div className="space-y-4"></div>
                    <h3 className="text-xl font-semibold">API Integration</h3>
                    <ApiList 
                        entityName="stores/{storeId}/sizes"
                        entityIdName="sizeId"
                    />
                </div>
            </div>
    );
};

export default SizesPage;
