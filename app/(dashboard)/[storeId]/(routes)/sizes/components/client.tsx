"use client";

import React from 'react'

import { Plus, } from 'lucide-react';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {  Size } from '@prisma/client';
import { DataTable } from '@/components/ui/data-table';
import { sizesCols } from './columns';


interface SizeClientProps {
    sizes: Size[];
    storeId: string;
}
const SizeClient = (
    { sizes, storeId }: SizeClientProps
) => {

    const router = useRouter();
    
    

    const handleAddNew = () => {
        router.push(`/${storeId}/sizes/new`);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className='flex items-center justify-between px-6 w-full py-8'>
                <div>
                    <Heading
                    title={`Sizes (${sizes && sizes.length})`}
                    description="Manage your sizes" />
                </div>
                <Button onClick={handleAddNew} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <div className="w-full h-auto ">
                <DataTable columns={sizesCols} data={sizes} searchKey={"name"} />
            </div> 

        </div>
    )
}

export default SizeClient