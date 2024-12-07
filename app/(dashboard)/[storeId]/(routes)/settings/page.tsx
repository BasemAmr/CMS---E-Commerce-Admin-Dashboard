import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import React from 'react'
import prismadb from '@/lib/prismadb';
import SettingsForm from './components/settings-form';

interface SettingsProps {
    params : {
        storeId: string;
    }
}

const Settings = async (
    { params } : SettingsProps
) => {

    const {userId} = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    });

    if (!store) {
        redirect("/");
    }


  return (
    <div className='flex flex-col'>
        <div className="flex-1 space-y-4 p-7 pt-9">
            <SettingsForm 
                initialData={store}
            />
        </div>
        
    </div>
  )
}

export default Settings