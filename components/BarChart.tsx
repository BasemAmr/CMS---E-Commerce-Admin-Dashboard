'use client';

import { formatter } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


const BarChartComponent = (
    { dailyRevenue } : { dailyRevenue: { date: string, revenue: number }[] }
) => {


    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyRevenue}>
                <XAxis 
                dataKey="date" 
                tickFormatter={(value) => value.split('-').slice(1).join('/')}
                tick={{ fontSize: 12 }}
                />
                <YAxis 
                tickFormatter={(value) => formatter.format(value)}
                tick={{ fontSize: 12 }}
                />
                <Tooltip 
                formatter={(value) => formatter.format(Number(value))}
                labelFormatter={(label) => label.split('-').slice(1).join('/')}
                />
                <Bar 
                dataKey="revenue" 
                fill="#2563eb" 
                radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default BarChartComponent;