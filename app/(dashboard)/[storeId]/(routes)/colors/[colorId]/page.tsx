import React from 'react';
import { Separator } from '@/components/ui/separator';
import ColorForm from '../components/form';

interface ColorPageProps {
  params: Promise<{ 
    storeId: string;
    colorId: string;
  }>;
}

const ColorPage = async ({ params }: ColorPageProps) => {
  const { colorId, storeId } =await  params;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={colorId} storeId={storeId} />
        <Separator />
      </div>
    </div>
  );
};

export default ColorPage;