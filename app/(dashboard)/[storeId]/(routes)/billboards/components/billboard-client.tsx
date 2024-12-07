"use client";

import React from 'react'

import { Plus, } from 'lucide-react';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Billboard } from '@prisma/client';
import { DataTable } from '@/components/ui/data-table';
import { billboardCols } from './columns';


interface BillboardClientProps {
    billboards: Billboard[];
    storeId: string;
}
const BillboardClient = (
    { billboards, storeId }: BillboardClientProps
) => {

    const router = useRouter();
    
    

    const handleAddNew = () => {
        router.push(`/${storeId}/billboards/new`);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className='flex items-center justify-between px-6 w-full py-8'>
                <div>
                    <Heading
                    title={`Billboards (${billboards && billboards.length})`}
                    description="Manage your billboards" />
                </div>
                <Button onClick={handleAddNew} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <div className="w-full h-auto ">
                <DataTable columns={billboardCols} data={billboards} searchKey={"label"} />
            </div> 

        </div>
    )
}

export default BillboardClient