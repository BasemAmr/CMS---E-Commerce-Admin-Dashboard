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
    console.time('fetchCategory');
    const category = await prismadb.category.findFirst({
        where: {
            id: categoryId
        },
        include: {
            billboards: true
        }
    });
    console.timeEnd('fetchCategory');
    return category;
}

async function fetchBillboards (storeId: string) {
    console.time('fetchBillboards');
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId
        }
    });
    console.timeEnd('fetchBillboards');
    return billboards;
}

const CategoryPage = async (
    { params }: CategoryPageProps
) => {

    const { categoryId, storeId } = await params;

    let category = null;
    console.time('fetchBillboards');
    const billboards = await fetchBillboards(storeId);
    console.timeEnd('fetchBillboards');
    if (categoryId !== 'new') {
        console.time('fetchCategory');
        category = await fetchCategory(categoryId) || null;
        console.timeEnd('fetchCategory');
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm initialData={category} storeId={storeId} billboards={billboards} />
                <Separator />
            </div>
        </div>
    );
};

export default CategoryPage;