import prismadb from '@/lib/prismadb';
import React from 'react'
import { Separator } from '@radix-ui/react-separator';
import CategoryForm from '../components/categories-form';

interface BillboardPageProps {
    params: {
        billboardId: string;
        storeId: string;
    };
}
const BillboardPage = async (
    { params }: BillboardPageProps
) => {

    const { billboardId, storeId } = await params;

    const category = await prismadb.category.findFirst({
        where: {
            id: billboardId,
        },
        include: {
            billboards: true,
        },
        
    }) || null;

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: storeId,
        },
    });
   
        

    return (
        <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm initialData={category} storeId = {storeId} billboards={billboards}/>
            <Separator />
        </div>
    </div>
    );
};  


export default BillboardPage