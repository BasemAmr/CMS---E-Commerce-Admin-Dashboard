import React from 'react';
import { Separator } from '@radix-ui/react-separator';
import ColorClient from './components/client';
import { ApiList } from '@/components/ui/api-alert';

interface ColorsProps {
    params: Promise<{
        storeId: string;
    }>;
}

async function fetchColors(storeId: string) {
    console.time('fetchColors');
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_STORE_URL}/api/stores/${storeId}/colors`, {
        next: { tags: ['colors'] },
        cache: 'force-cache'
    });
    const colors = await response.json();
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