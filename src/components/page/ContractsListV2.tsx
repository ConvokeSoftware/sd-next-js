'use client';

import {
  Contracts,
  LastTradePrice,
  LastTradePrice100,
  LastTradePriceWith7DaysChange,
} from '@/lib/types';
import { useEffect, useState } from 'react';
import {
  fetchContracts,
  fetchLastTradePrices,
  fetchLastTradePricesWith7DaysChange,
  fetchLastTradePricesX100,
} from '@/actions/actions';
import { Line, LineChart, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export function ContractsListV2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedContractId = Number(searchParams.get('contract')) || null;
  const [contracts, setContracts] = useState<Contracts[]>([]);
  const [lastTradePrices, setLastTradePrices] = useState<Record<number, LastTradePrice>>({});
  const [lastTradePricesWith7DaysChange, setLastTradePricesWith7DaysChange] = useState<
    Record<number, LastTradePriceWith7DaysChange>
  >({});
  const [tradePrices, setTradePrices] = useState<Record<number, LastTradePrice100[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [contractsData, prices, pricesWith7DaysChange] = await Promise.all([
          fetchContracts(),
          fetchLastTradePrices(),
          fetchLastTradePricesWith7DaysChange(),
        ]);

        // Convert prices array to a map for easier lookup
        const pricesMap = prices.reduce(
          (acc, price) => {
            acc[price.contract_id] = price;
            return acc;
          },
          {} as Record<number, LastTradePrice>
        );

        const pricesWith7DaysChangeMap = pricesWith7DaysChange.reduce(
          (acc, price) => {
            acc[price.contract_id] = price;
            return acc;
          },
          {} as Record<number, LastTradePriceWith7DaysChange>
        );

        setContracts(contractsData);
        setLastTradePrices(pricesMap);
        setLastTradePricesWith7DaysChange(pricesWith7DaysChangeMap);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Load trade prices for each contract
  useEffect(() => {
    const loadTradePrices = async () => {
      const prices: Record<number, LastTradePrice100[]> = {};
      for (const contract of contracts) {
        const data = await fetchLastTradePricesX100(contract.contract_id);
        prices[contract.contract_id] = data;
      }
      setTradePrices(prices);
    };

    if (contracts.length > 0) {
      loadTradePrices();
    }
  }, [contracts]);

  // Helper to get min/max for Y domain
  const getYDomain = (data: LastTradePrice100[]) => {
    if (!data || data.length === 0) return [0, 1];
    const prices = data.map((d) => d.last_price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) {
      return [min - 0.01, max + 0.01];
    }
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-0">
        {isLoading ? (
          <div className="text-center py-4">Loading Contracts...</div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No contracts found</div>
        ) : (
          contracts.map((contract, idx) => (
            <React.Fragment key={contract.contract_id}>
              <div
                className={cn(
                  'flex flex-col gap-2 p-2 cursor-pointer transition-colors rounded-lg',
                  selectedContractId === contract.contract_id && 'bg-blue-900/20'
                )}
                onClick={() => {
                  const params = new URLSearchParams(Array.from(searchParams.entries()));
                  params.set('contract', contract.contract_id.toString());
                  router.replace(`?${params.toString()}`, { scroll: false });
                }}
              >
                {/* Row 1: Name/Vol (left), Price/Percent (right) */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-base truncate">{contract.team_name}</span>
                    <span className="text-xs text-muted-foreground">
                      Vol: {lastTradePrices[contract.contract_id]?.last_volume || 0}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-base whitespace-nowrap">
                      ${lastTradePrices[contract.contract_id]?.last_price || 0}
                    </span>
                    <span
                      className={cn(
                        'flex items-center gap-1 font-medium text-xs',
                        (lastTradePricesWith7DaysChange[contract.contract_id]?.price_change_7d ||
                          0) > 0
                          ? 'text-green-500'
                          : (lastTradePricesWith7DaysChange[contract.contract_id]
                                ?.price_change_7d || 0) < 0
                            ? 'text-red-500'
                            : 'text-gray-400'
                      )}
                    >
                      {(lastTradePricesWith7DaysChange[contract.contract_id]?.price_change_7d ||
                        0) > 0 ? (
                        <ArrowUpIcon className="h-3 w-3" />
                      ) : (lastTradePricesWith7DaysChange[contract.contract_id]?.price_change_7d ||
                          0) < 0 ? (
                        <ArrowDownIcon className="h-3 w-3" />
                      ) : null}
                      {(lastTradePricesWith7DaysChange[contract.contract_id]?.price_change_7d ||
                        0) > 0
                        ? '+'
                        : ''}
                      {lastTradePricesWith7DaysChange[contract.contract_id]?.price_change_7d || 0}%
                    </span>
                  </div>
                </div>
                {/* Row 2: Logo (left), Mini graph (right, flex-1) */}
                <div className="flex items-center gap-2">
                  <img
                    src={`/images/nfl_team_images/${contract.contract_id}.png`}
                    alt={contract.abbreviation}
                    className="w-10 h-10 object-contain rounded-full bg-black/10"
                  />
                  <div className="flex-1">
                    {Array.isArray(tradePrices[contract.contract_id]) &&
                      tradePrices[contract.contract_id].length > 0 && (
                        <div className="w-full h-8">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={tradePrices[contract.contract_id].slice().reverse()}
                              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                            >
                              <Line
                                type="monotone"
                                dataKey="last_price"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                              />
                              <YAxis domain={getYDomain(tradePrices[contract.contract_id])} hide />
                              <XAxis hide />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                  </div>
                  <div
                    className={cn(
                      'flex flex-row border rounded-md',
                      selectedContractId === contract.contract_id
                        ? 'border-white'
                        : 'border-zinc-300'
                    )}
                  >
                    <button className="text-black px-2 py-1 rounded-md border-r border-inherit">
                      Buy
                    </button>
                    <button className="text-black px-2 py-1 rounded-md">Sell</button>
                  </div>
                </div>
              </div>
              {idx < contracts.length - 1 && <div className="border-b border-zinc-300 my-1" />}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}
