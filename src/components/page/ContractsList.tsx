'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Contracts, LastTradePrice, LastTradePrice100 } from '@/lib/types';
import { useEffect, useState } from 'react';
import { fetchLastTradePricesX100 } from '@/actions/actions';
import { Line, LineChart, ResponsiveContainer, YAxis, XAxis } from 'recharts';

interface ContractsListProps {
  contracts: Contracts[];
  lastTradePrices: Record<number, LastTradePrice>;
  selectedContractId: number | null;
  isLoading: boolean;
  onContractSelect: (contractId: number) => void;
}

export function ContractsList({
  contracts,
  lastTradePrices,
  selectedContractId,
  isLoading,
  onContractSelect,
}: ContractsListProps) {
  const [tradePrices, setTradePrices] = useState<Record<number, LastTradePrice100[]>>({});

  useEffect(() => {
    const loadTradePrices = async () => {
      const prices: Record<number, LastTradePrice100[]> = {};
      for (const contract of contracts) {
        const data = await fetchLastTradePricesX100(contract.contract_id);
        prices[contract.contract_id] = data;
      }
      setTradePrices(prices);
    };

    loadTradePrices();
  }, [contracts]);

  // Helper to get min/max for Y domain
  const getYDomain = (data: LastTradePrice100[]) => {
    if (!data || data.length === 0) return [0, 1];
    const prices = data.map((d) => d.last_price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) {
      // Add a small range if all prices are the same
      return [min - 0.01, max + 0.01];
    }
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  };

  return (
    <Card className="h-full p-4 flex flex-col overflow-hidden">
      <h2 className="text-lg font-semibold mb-4">Contracts</h2>
      <div className="grid grid-cols-1 gap-2 overflow-y-auto">
        {isLoading ? (
          <div className="col-span-2 text-center py-4">Loading Contracts...</div>
        ) : (
          contracts.map((contract) => {
            const chartData = tradePrices[contract.contract_id]?.slice().reverse() || [];
            const yDomain = getYDomain(chartData);
            return (
              <Card
                key={contract.contract_id}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-100 flex flex-col gap-2 ${
                  selectedContractId === contract.contract_id ? 'bg-blue-100 hover:bg-blue-100' : ''
                }`}
                onClick={() => onContractSelect(contract.contract_id)}
              >
                <div className="flex flex-row text-sm text-gray-500 justify-between">
                  <div className="font-bold">{contract.contract_id}</div>
                  <span>
                    {contract.team_name} ( {contract.abbreviation} )
                  </span>
                  <span>{contract.league}</span>
                </div>
                <span className="text-sm text-gray-600">{contract.measurable}</span>
                <div className="flex flex-row justify-between items-center">
                  <Image
                    src={`/images/nfl_team_images/${contract.contract_id}.png`}
                    alt={contract.abbreviation}
                    width={48}
                    height={48}
                  />
                  <div className="text-lg text-gray-600">
                    {lastTradePrices[contract.contract_id]
                      ? `$${lastTradePrices[contract.contract_id].last_price}`
                      : 'No price data'}
                  </div>
                </div>
                {chartData.length > 0 && (
                  <div className="h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <Line
                          type="monotone"
                          dataKey="last_price"
                          stroke="var(--color-chart-1)"
                          strokeWidth={2}
                          dot={false}
                        />
                        {/* Hide axes for sparkline effect */}
                        {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
                        {/* <Tooltip formatter={(value: number) => [`$${value}`, 'Price']} labelFormatter={(label) => new Date(label).toLocaleTimeString()} /> */}
                        <YAxis domain={yDomain} hide />
                        <XAxis hide />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </Card>
  );
}
