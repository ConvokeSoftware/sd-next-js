'use client';

import { Card } from '@/components/ui/card';
import { TradeHistory } from '@/lib/types';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { fetchTradeHistoryForContract } from '@/app/actions';

interface HistoricalDataProps {
  isLoadingHistoricalData: boolean;
  selectedContractId: number | null;
}

export function HistoricalData({
  isLoadingHistoricalData: externalLoading,
  selectedContractId,
}: HistoricalDataProps) {
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadTradeHistory() {
      if (!selectedContractId) {
        setTradeHistory([]);
        return;
      }

      try {
        setIsLoading(true);
        const history = await fetchTradeHistoryForContract(selectedContractId, 'day');
        setTradeHistory(history || []);
      } catch (error) {
        console.error('Failed to fetch trade history:', error);
        setTradeHistory([]);
      } finally {
        setIsLoading(false);
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

  return (
    <Card className="max-h-[400px]">
      <CardHeader>
        <CardDescription>
          {selectedContractId
            ? `Contract ${selectedContractId} Trading History (Day)`
            : 'Select a contract to view history'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || externalLoading ? (
          <div className="text-center py-4">Loading historical data...</div>
        ) : tradeHistory.length > 0 ? (
          <div className="w-full h-[300px]">
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
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip formatter={(value: number) => [`$${value}`, 'Price']} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={{
                    fill: 'var(--color-chart-1)',
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                    fill: 'var(--color-chart-1)',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
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
