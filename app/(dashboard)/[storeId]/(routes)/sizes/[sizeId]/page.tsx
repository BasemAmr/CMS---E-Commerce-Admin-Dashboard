import prismadb from '@/lib/prismadb';
import React from 'react'
import { Separator } from '@radix-ui/react-separator';
import SizeForm from '../components/size-form';

interface SizesPageProps {
    params:  Promise<{
        sizeId: string;
        storeId: string;
    }>;
}

async function fetchSize (sizeId: string) {
    const size = await prismadb.size.findFirst({
        where: {
            id: sizeId
        }
    });
    return size;
}

const SizesPage = async (
    { params }: SizesPageProps
) => {
    console.time('SizesPage');

    const { sizeId, storeId } = await params;

    const size =  sizeId === 'new' ? null : (await fetchSize(sizeId)) || null;
   
    console.timeEnd('SizesPage');

    return (
        <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SizeForm initialData={size} storeId = {storeId}/>
            <Separator />
        </div>
    </div>
    );
};  


export default SizesPage