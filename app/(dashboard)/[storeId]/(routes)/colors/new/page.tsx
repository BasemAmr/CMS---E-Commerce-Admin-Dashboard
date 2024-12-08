import React from 'react';
import { Separator } from '@radix-ui/react-separator';
import ColorForm from '../components/color-form';
import prismadb from '@/lib/prismadb';
import { Color } from '@prisma/client';

interface ColorsNewPageProps {
    params: {
        storeId: string;
    };
}

const ColorsNewPage = async ({ params }: ColorsNewPageProps) => {
    const { storeId } = params;

    // Optionally, verify store existence here

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorForm initialData={null} storeId={storeId} />
                <Separator />
            </div>
        </div>
    );
};

export default ColorsNewPage;