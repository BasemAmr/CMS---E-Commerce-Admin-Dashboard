"use client";

import React from 'react'

import { Plus, } from 'lucide-react';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { categoriesCols, categoryPopulateBillboards } from './columns';


interface CategoryClientProps {
    categories: categoryPopulateBillboards[];
    storeId: string;
}
const CategoryClient = (
    { categories, storeId }: CategoryClientProps 
) => {

    const router = useRouter();
    
    

    const handleAddNew = () => {
        router.push(`/${storeId}/categories/new`);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className='flex items-center justify-between px-6 w-full py-8'>
                <div>
                    <Heading
                    title={`Categories (${categories && categories.length})`}
                    description="Manage your Categories" />
                </div>
                <Button onClick={handleAddNew} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <div className="w-full h-auto ">
                <DataTable columns={categoriesCols} data={categories} searchKey={"name"} />
            </div> 

        </div>
    )
}

export default CategoryClient