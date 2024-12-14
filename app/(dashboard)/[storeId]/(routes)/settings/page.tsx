import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import React, { Suspense } from 'react'
import prismadb from '@/lib/prismadb';
import SettingsForm from './components/settings-form';

interface SettingsProps {
    params : Promise<{
        storeId: string;
    }>
}

const Settings = async (
    { params } : SettingsProps
) => {

    const {userId} = await auth();
    const {storeId} = await params;
    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: storeId,
            userId
        }
    });

    if (!store) {
        redirect("/");
    }


  return (
    <div className='flex flex-col'>
        <div className="flex-1 space-y-4 p-7 pt-9">
        <Suspense fallback={<>Loading...</>}>
            <SettingsForm 
                initialData={store}
            />
        </Suspense>
        </div>
        
    </div>
  )
}

export default Settings