import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import React from 'react'

interface DashboardPageProps {
  params: {
    storeId: string;
  }
}

const DashboardPage: React.FC<DashboardPageProps> = async (
  { params }
) => {

  const {userId} = await auth();
  const {storeId} = await params;
  const store = userId ? await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId
    }
  }) : null;

  return (
    <div>
      Active Store: {store?.name}
    </div>
  )
}

export default DashboardPage