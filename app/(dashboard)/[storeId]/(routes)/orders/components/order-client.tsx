"use client";

import React from 'react'
import Heading from '@/components/ui/heading';

import { DataTable } from '@/components/ui/data-table';
import { OrdersCols, ordersCols } from './columns';


interface OrderClientProps {
    orders: OrdersCols[];
}
const OrderClient = (
    { orders }: OrderClientProps
) => {

    return (
        <div className="flex flex-col gap-4">
            <div className='flex items-center justify-between px-6 w-full py-8'>
                <div>
                    <Heading
                    title={`orders (${orders && orders.length})`}
                    description="Manage your orders" />
                </div>
            </div>
            <div className="w-full h-auto ">
                <DataTable columns={ordersCols} data={orders} searchKey={"products"} />
            </div> 

        </div>
    )
}

export default OrderClient