import prismadb from '@/lib/prismadb';
import React from 'react';
import { Separator } from '@radix-ui/react-separator';
import ColorClient from './components/client';
import { ApiList } from '@/components/ui/api-alert';

interface ColorsProps {
    params: Promise<{
        storeId: string;
    }>;
}

async function fetchColors (storeId: string) {
    console.time('fetchColors');
    const colors = await prismadb.color.findMany({
        where: {
            storeId
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    console.timeEnd('fetchColors');
    return colors;
}

const ColorsPage = async ({ params }: ColorsProps) => {
    const { storeId } = await params;
    console.time('ColorsPage');
    const colors = await fetchColors(storeId);
    console.timeEnd('ColorsPage');
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="space-y-4">
                    <ColorClient colors={colors} storeId={storeId} />
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">API Integration</h3>
                    <ApiList 
                        entityName="stores/{storeId}/colors"
                        entityIdName="colorId"
                    />
                </div>
            </div>
        </div>
    );
};

export default ColorsPage;