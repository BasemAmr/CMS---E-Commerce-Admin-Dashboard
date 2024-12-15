import prismadb from '@/lib/prismadb';
import React from 'react'
import BillboardForm from '../components/billboards-form';
import { Separator } from '@radix-ui/react-separator';

interface BillboardPageProps {
    params: Promise<{
        billboardId: string;
        storeId: string;
    }>;
}

async function fetchBillboard (billboardId: string) {
    console.time('fetchBillboard');
    const billboard = await prismadb.billboard.findFirst({
        where: {
            id: billboardId
        }
    });
    console.timeEnd('fetchBillboard');
    return billboard;
}

const BillboardPage = async (
    { params }: BillboardPageProps
) => {

    const { billboardId, storeId } = await params;

    let billboard = null;
    if (billboardId !== 'new') {
        billboard = await fetchBillboard(billboardId) || null;
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboard} storeId={storeId} />
                <Separator />
            </div>
        </div>
    );
};  

export default BillboardPage;
