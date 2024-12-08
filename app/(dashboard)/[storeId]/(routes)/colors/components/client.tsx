"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Color } from '@prisma/client';
import { DataTable } from '@/components/ui/data-table';
import { colorsCols } from './columns';

interface ColorClientProps {
    colors: Color[];
    storeId: string;
}

const ColorClient = ({ colors, storeId }: ColorClientProps) => {
    const router = useRouter();

    const handleAddNew = () => {
        router.push(`/${storeId}/colors/new`);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className='flex items-center justify-between px-6 w-full py-8'>
                <div>
                    <Heading
                        title={`Colors (${colors.length})`}
                        description="Manage your colors" />
                </div>
                <Button onClick={handleAddNew} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <div className="w-full h-auto ">
                <DataTable columns={colorsCols} data={colors} searchKey={"name"} />
            </div> 
        </div>
    )
}

export default ColorClient;