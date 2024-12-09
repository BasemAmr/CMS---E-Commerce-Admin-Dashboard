"use client";

import React from 'react'

import { Plus, } from 'lucide-react';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { ProductCols, productsCols } from './columns';


interface ProductClientProps {
    products: ProductCols[];
    storeId: string;
}
const ProductClient = (
    { products, storeId }: ProductClientProps
) => {

    const router = useRouter();
    
    

    const handleAddNew = () => {
        router.push(`/${storeId}/products/new`);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className='flex items-center justify-between px-6 w-full py-8'>
                <div>
                    <Heading
                    title={`Product (${products && products.length})`}
                    description="Manage your products" />
                </div>
                <Button onClick={handleAddNew} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <div className="w-full h-auto ">
                <DataTable columns={productsCols} data={products} searchKey={"name"} />
            </div> 

        </div>
    )
}

export default ProductClient