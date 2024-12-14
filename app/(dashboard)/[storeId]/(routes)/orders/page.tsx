import OrderClient from './components/order-client';
import prismadb from '@/lib/prismadb';
import { OrdersCols } from './components/columns';

interface OrdersPageProps {
    params: {
        storeId: string;
    };
}

const OrdersPage = async ({ params }: OrdersPageProps) => {
    const { storeId } = await params;
    const orders = await prismadb.order.findMany({
        where: {
            storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });
    
const formattedOrders: OrdersCols[] = orders.map(order => {
    return {
        id: order.id,
        phone: order.phone,
        address: order.address,
        totalPrice: `EGP ${(order.orderItems.reduce((acc, item) => acc + item.product.price, 0)).toFixed(2)}`,
        products: order.orderItems.map(item => item.product.name).join(", "),
        isPaid: order.isPaid,
        createdAt: order.createdAt,
    }    
});

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="space-y-4">
                    <OrderClient orders={formattedOrders}/>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
