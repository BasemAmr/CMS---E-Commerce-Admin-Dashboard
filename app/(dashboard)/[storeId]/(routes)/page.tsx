import prismadb from '@/lib/prismadb';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import  Heading  from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { formatter } from '@/lib/utils';
import { CreditCard, DollarSign, Package } from 'lucide-react';

interface DashboardPageProps {
  params: {
    storeId: string;
  }
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  
  
  const {storeId} = await params;

  // Get paid orders
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  // Get products in stock
  const stockCount = await prismadb.product.count({
    where: {
      storeId,
      isArchived: false,
    }
  });

  // Calculate total revenue
  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.product.price;
    }, 0);
    return total + orderTotal;
  }, 0);

  // Calculate last 7 days revenue for simple chart
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyRevenue = last7Days.map(date => {
    const dayOrders = paidOrders.filter(order => 
      order.createdAt.toISOString().split('T')[0] === date
    );
    const revenue = dayOrders.reduce((sum, order) => {
      return sum + order.orderItems.reduce((orderSum, item) => 
        orderSum + item.product.price, 0);
    }, 0);
    return { date, revenue };
  });

  const maxRevenue = Math.max(...dailyRevenue.map(d => d.revenue));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{paidOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products In Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-end gap-2">
              {dailyRevenue.map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-blue-600 rounded-t-md transition-all duration-300"
                    style={{ 
                      height: `${(day.revenue / maxRevenue) * 100}%`,
                      minHeight: day.revenue > 0 ? '10%' : '0%'
                    }}
                  />
                  <span className="text-xs text-muted-foreground rotate-45 origin-left">
                    {day.date.split('-').slice(1).join('/')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;