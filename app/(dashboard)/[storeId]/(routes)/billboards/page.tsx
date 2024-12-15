import { Separator } from '@/components/ui/separator';
import BillboardClient from './components/billboard-client';
import { ApiList } from '@/components/ui/api-alert';
import prismadb from '@/lib/prismadb';

interface BillboardFormProps {
    params: Promise<{
        storeId: string;
    }>;
}

async function fetchBillboards(storeId: string) {
    console.time('fetchBillboards');
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId
        }
    });
    console.timeEnd('fetchBillboards');
    return billboards;
}

const BillboardsPage = async ({ params }: BillboardFormProps) => {
    console.time('BillboardsPage');
    const { storeId } = await params;
    const billboards = await fetchBillboards(storeId);
    console.timeEnd('BillboardsPage');
    
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="space-y-4">
                    <BillboardClient billboards={billboards} storeId={storeId} />
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">API Integration</h3>
                    <ApiList 
                        entityName="stores/{storeId}/billboards"
                        entityIdName="billboardId"
                    />
                </div>
            </div>
        </div>
    );
};

export default BillboardsPage;
