import React from 'react';
import { Separator } from '@radix-ui/react-separator';
import ColorForm from '../components/color-form';

interface ColorsEditPageProps {
    params: Promise<{
        colorId: string;
        storeId: string;
    }>;
}
async function fetchColor(colorId: string, storeId: string) {
    console.time('fetchColor');
    const response = await fetch(`${process.env.BACKEND_STORE_URL}/api/stores/${storeId}/colors/${colorId}`, {
        next: { tags: [`color-${colorId}`] },
        cache: 'force-cache'
    });
    const color = await response.json();
    console.timeEnd('fetchColor');
    return color;
}

const ColorsEditPage = async ({ params }: ColorsEditPageProps) => {
    const { colorId, storeId } = await params;

    console.time('fetchColor');
    const color = await fetchColor(colorId, storeId) || null;
    console.timeEnd('fetchColor');

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