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

const ColorsPage = async ({ params }: ColorsProps) => {
    const { storeId } = await params;
    const colors = await prismadb.color.findMany({
        where: {
            storeId
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

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