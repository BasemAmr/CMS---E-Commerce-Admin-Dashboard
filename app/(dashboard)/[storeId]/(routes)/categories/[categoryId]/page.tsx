import React from 'react'
import { Separator } from '@radix-ui/react-separator';
import CategoryForm from '../components/categories-form';

interface CategoryPageProps {
    params: Promise<{
        categoryId: string;
        storeId: string;
    }>;
}

async function fetchCategory(storeId: string, categoryId: string) {
    console.time('fetchCategory');
    const category = await fetch(`${process.env.BACKEND_STORE_URL}/api/stores/${storeId}/categories/${categoryId}`, {
        next: { tags: [`category-${categoryId}`] }
    }).then(res => res.json());
    console.timeEnd('fetchCategory');
    return category;
}

async function fetchBillboards(storeId: string) {
    console.time('fetchBillboards');
    const billboards = await fetch(`${process.env.BACKEND_STORE_URL}/api/stores/${storeId}/billboards`, {
        next: { tags: ['billboards'] },
        cache: 'force-cache'
    }).then(res => res.json());
    console.timeEnd('fetchBillboards');
    return billboards;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
    const { categoryId, storeId } = await params;

    let category = null;
    console.time('fetchBillboards');
    const billboards = await fetchBillboards(storeId);
    console.timeEnd('fetchBillboards');
    if (categoryId !== 'new') {
        console.time('fetchCategory');
        category = await fetchCategory(storeId, categoryId) || null;
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