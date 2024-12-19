import { Separator } from '@/components/ui/separator';
import { ApiList } from '@/components/ui/api-alert';
import SizeClient from './components/client';

interface SizesProps {
    params: Promise<{
        storeId: string;
    }>;
}
async function fetchSizes(storeId: string) {
    const res = await fetch(`/${process.env.NEXT_PUBLIC_BACKEND_STORE_URL}/api/stores/${storeId}/sizes`, {
        next: {
            tags: ['sizes']
        },
        cache: 'force-cache'
    });
    return res.json();
}

const SizesPage = async ({ params }: SizesProps) => {
    const { storeId } = await params;
    const sizes = await fetchSizes(storeId) || [];
    
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
