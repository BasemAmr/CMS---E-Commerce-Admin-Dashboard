import prismadb from '@/lib/prismadb';
import React from 'react'
import { Separator } from '@radix-ui/react-separator';
import CategoryForm from '../components/categories-form';

interface CategoryPageProps {
    params: Promise<{
        categoryId: string;
        storeId: string;
    }>;
}
const CategoryPage = async (
    { params }: CategoryPageProps
) => {

    const { categoryId, storeId } = await params;

    const category = await prismadb.category.findFirst({
        where: {
            id: categoryId,
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


export default CategoryPage