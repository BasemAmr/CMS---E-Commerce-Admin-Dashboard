import React from 'react';
import { Separator } from '@radix-ui/react-separator';
import ColorForm from '../components/color-form';

interface ColorsNewPageProps {
    params: Promise<{
        storeId: string;
    }>;
}

const ColorsNewPage = async ({ params }: ColorsNewPageProps) => {
    const { storeId } = await params;


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