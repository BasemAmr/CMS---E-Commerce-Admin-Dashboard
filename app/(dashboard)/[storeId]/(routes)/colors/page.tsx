import React from 'react';
import { Separator } from '@/components/ui/separator';
import { ColorList } from './components/list';
import { ApiList } from '@/components/ui/api-alert';

interface ColorsPageProps {
  params: Promise<{ storeId: string }>;
}

const ColorsPage = async ({ params }: ColorsPageProps) => {
  const { storeId } = await params;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorList storeId={storeId} />
        <Separator className="my-4" />
        <ApiList 
          entityName="colors"
          entityIdName="colorId"
          storeId={storeId}
        />
      </div>
    </div>
  );
};

export default ColorsPage;