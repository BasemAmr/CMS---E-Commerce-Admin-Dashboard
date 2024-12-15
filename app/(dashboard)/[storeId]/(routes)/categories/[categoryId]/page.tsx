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

async function fetchCategory (categoryId: string) {
    const category = await prismadb.category.findFirst({
        where: {
            id: categoryId
        },
        include: {
            billboards: true
        }
    });
    return category;
}

async function fetchBillboards (storeId: string) {
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId
        }
    });
    return billboards;
}

const CategoryPage = async (
    { params }: CategoryPageProps
) => {

    const { categoryId, storeId } = await params;


    let category = null;
    const billboards = await fetchBillboards(storeId);
    if (categoryId !== 'new') {
         category = await  fetchCategory(categoryId) || null;

    }
   
        

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