'use client';

import { fetchTradeHistoryForContract } from '@/actions/actions';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TradeHistory } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface MainGraphProps {
  isLoading?: boolean;
}

export function MainGraph({ isLoading = false }: MainGraphProps) {
  const searchParams = useSearchParams();
  const selectedContractId = Number(searchParams.get('contract')) || null;
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    async function loadTradeHistory() {
      if (!selectedContractId) {
        setTradeHistory([]);
        return;
      }

      try {
        setIsLoadingData(true);
        const history = await fetchTradeHistoryForContract(selectedContractId, 'day');
        setTradeHistory(history || []);
      } catch (error) {
        console.error('Failed to fetch trade history:', error);
        setTradeHistory([]);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadTradeHistory();
  }, [selectedContractId]);

  // Format the data for the chart
  const chartData = tradeHistory.map((trade) => ({
    date: new Date(trade.trade_time_block).toLocaleDateString(),
    price: trade.average_price,
    volume: trade.total_volume,
  }));

  const chartConfig = {
    price: {
      label: 'Price',
      theme: {
        light: 'oklch(0.646 0.222 41.116)',
        dark: 'oklch(0.488 0.243 264.376)',
      },
    },
    volume: {
      label: 'Volume',
      theme: {
        light: 'oklch(0.6 0.118 184.704)',
        dark: 'oklch(0.696 0.17 162.48)',
      },
    },
  };

  return (
    <Card className="">
      <CardHeader>
        <CardDescription>
          {selectedContractId
            ? `Contract ${selectedContractId} Trading History`
            : 'Select a contract to view history'}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        {isLoading || isLoadingData ? (
          <div className="text-center py-4">Loading historical data...</div>
        ) : tradeHistory.length > 0 ? (
          <div className="max-w-[750px] w-full h-[500px] mx-auto">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value: ValueType, name: NameType) => {
                          if (name === 'price') return [`$${value}`, 'Price'];
                          return [value.toLocaleString(), 'Volume'];
                        }}
                      />
                    }
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="price"
                    name="price"
                    stroke="var(--color-price)"
                    strokeWidth={2}
                    dot={{
                      fill: 'var(--color-price)',
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                      fill: 'var(--color-price)',
                    }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="volume"
                    name="volume"
                    stroke="var(--color-volume)"
                    strokeWidth={2}
                    dot={{
                      fill: 'var(--color-volume)',
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                      fill: 'var(--color-volume)',
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            {selectedContractId
              ? 'No historical data available'
              : 'Select a contract to view historical data'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
