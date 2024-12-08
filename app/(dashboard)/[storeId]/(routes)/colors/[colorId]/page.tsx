import prismadb from '@/lib/prismadb';
import React from 'react';
import { Separator } from '@radix-ui/react-separator';
import ColorForm from '../components/color-form';
import { Color } from '@prisma/client';

interface ColorsEditPageProps {
    params: {
        colorId: string;
        storeId: string;
    };
}

const ColorsEditPage = async ({ params }: ColorsEditPageProps) => {
    const { colorId, storeId } = params;

    const color = await prismadb.color.findFirst({
        where: {
            id: colorId,
            storeId: storeId,
        },
    }) || null;

    if (!color) {
        return (
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <h1 className="text-2xl font-semibold">Color not found</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorForm initialData={color} storeId={storeId} />
                <Separator />
            </div>
        </div>
    );
};

export default ColorsEditPage;