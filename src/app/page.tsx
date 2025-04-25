'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

import {
  ContractBuyOrder,
  Contracts,
  ContractSellOrder,
  LastTradePrice,
  LastTradePrice100,
  LastTradePriceWith7DaysChange,
} from '@/lib/types';
import {
  fetchContractBuyOrders,
  fetchContracts,
  fetchContractSellOrders,
  fetchLastTradePrices,
  fetchLastTradePricesWith7DaysChange,
  fetchLastTradePricesX100,
} from './actions';

import Image from 'next/image';

export default function Home() {
  const [contracts, setContracts] = useState<Contracts[]>([]);
  const [lastTradePrices, setLastTradePrices] = useState<Record<number, LastTradePrice>>({});
  const [lastTradePricesX100, setLastTradePricesX100] = useState<LastTradePrice100[]>([]);
  const [lastTradePricesWith7DaysChange, setLastTradePricesWith7DaysChange] = useState<
    Record<number, LastTradePriceWith7DaysChange>
  >({});
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buyOrders, setBuyOrders] = useState<ContractBuyOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<ContractSellOrder[]>([]);
  const [isLoadingHistoricalData, setIsLoadingHistoricalData] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [contracts, prices, pricesWith7DaysChange] = await Promise.all([
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

        setContracts(contracts);
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

  useEffect(() => {
    const loadHistoricalPrices = async () => {
      if (selectedContractId) {
        try {
          setIsLoadingHistoricalData(true);
          const prices = await fetchLastTradePricesX100(selectedContractId);
          setLastTradePricesX100(prices);
        } catch (error) {
          console.error('Failed to fetch historical prices:', error);
        } finally {
          setIsLoadingHistoricalData(false);
        }
      } else {
        setLastTradePricesX100([]);
      }
    };

    const loadBuySellOrders = async () => {
      if (selectedContractId) {
        try {
          setIsLoadingOrders(true);
          const [buyOrders, sellOrders] = await Promise.all([
            fetchContractBuyOrders(selectedContractId),
            fetchContractSellOrders(selectedContractId),
          ]);
          setBuyOrders(buyOrders);
          setSellOrders(sellOrders);
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        } finally {
          setIsLoadingOrders(false);
        }
      } else {
        setBuyOrders([]);
        setSellOrders([]);
      }
    };

    loadHistoricalPrices();
    loadBuySellOrders();
  }, [selectedContractId]);

  return (
    <main className="h-[100dvh] p-4 flex flex-col w-full overflow-hidden">
      <div className="grid grid-cols-12 gap-4 flex-grow overflow-hidden">
        {/* Markets Column - Left Side */}
        <div className="col-span-3 overflow-hidden">
          <Card className="h-full p-4 flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold mb-4">Contracts</h2>
            <div className="grid grid-cols-1 gap-2 overflow-y-auto">
              {isLoading ? (
                <div className="col-span-2 text-center py-4">Loading Contracts...</div>
              ) : (
                contracts.map((contract) => (
                  <Card
                    key={contract.contract_id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-100 flex flex-col gap-2 ${
                      selectedContractId === contract.contract_id
                        ? 'bg-blue-100 hover:bg-blue-100'
                        : ''
                    }`}
                    onClick={() => setSelectedContractId(contract.contract_id)}
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
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Main Content Column - Right Side */}
        <div className="col-span-9 space-y-4 overflow-y-auto">
          {/* Balance Row */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Balance</h2>
            {/* Balance content will go here */}
          </Card>

          {/* Selected Row */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Selected</h2>
            {selectedContractId ? (
              <div>
                <div className="text-xl">Contract: {selectedContractId}</div>
                {lastTradePrices[selectedContractId] &&
                  lastTradePricesWith7DaysChange[selectedContractId] && (
                    <div className="mt-2 flex flex-row gap-4 items-center">
                      <div className="text-lg">
                        Current Price: ${lastTradePrices[selectedContractId].last_price}
                      </div>
                      <div className="text-sm text-gray-600">
                        Last Volume: {lastTradePrices[selectedContractId].last_volume}
                      </div>
                      <div className="text-sm text-gray-600">
                        Last Update:{' '}
                        {new Date(lastTradePrices[selectedContractId].last_utc).toLocaleString()}
                      </div>
                      <div
                        className={`text-sm ${
                          lastTradePricesWith7DaysChange[selectedContractId].price_change_7d > 0
                            ? 'text-green-600'
                            : lastTradePricesWith7DaysChange[selectedContractId].price_change_7d < 0
                              ? 'text-red-600'
                              : 'text-gray-600'
                        }`}
                      >
                        7d Change:{' '}
                        {lastTradePricesWith7DaysChange[selectedContractId].price_change_7d > 0
                          ? '+'
                          : ''}
                        {lastTradePricesWith7DaysChange[selectedContractId].price_change_7d}
                      </div>
                      <div className="text-sm text-gray-600">
                        7d Volume:{' '}
                        {lastTradePricesWith7DaysChange[
                          selectedContractId
                        ].volume_7d.toLocaleString()}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div>No contract selected</div>
            )}
          </Card>

          {/* Graph and Buy/Sell Row */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Graph</h2>
              <div className="text-sm text-gray-600 mb-2">
                Note: This data will be used to populate graph points
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
                {isLoadingHistoricalData ? (
                  <div className="text-center py-4">Loading historical data...</div>
                ) : lastTradePricesX100.length > 0 ? (
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr>
                        <th className="text-left p-2">Time</th>
                        <th className="text-right p-2">Price</th>
                        <th className="text-right p-2">Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastTradePricesX100.map((price, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2 text-sm">
                            {new Date(price.last_utc).toLocaleString()}
                          </td>
                          <td className="p-2 text-right text-sm">${price.last_price}</td>
                          <td className="p-2 text-right text-sm">{price.last_volume}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-gray-500">
                    {selectedContractId
                      ? 'No historical data available'
                      : 'Select a contract to view historical data'}
                  </div>
                )}
              </div>
            </Card>
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Buy/Sell</h2>
              {/* Buy/Sell content will go here */}
            </Card>
          </div>

          {/* Orders Row */}
          <Card className="p-4 flex flex-row gap-4 max-h-[300px] overflow-hidden">
            <div className="w-full">
              <h2 className="text-lg font-semibold mb-4">Buy Orders</h2>
              <div className="overflow-y-auto max-h-[300px]">
                {!selectedContractId ? (
                  <div className="text-center text-gray-500 py-4">
                    Select a contract to view buy orders
                  </div>
                ) : isLoadingOrders ? (
                  <div className="text-center py-4">Loading buy orders...</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white">
                      <tr>
                        <th className="text-left p-2">Order ID</th>
                        <th className="text-right p-2">Price</th>
                        <th className="text-right p-2">Contracts</th>
                        <th className="text-right p-2">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buyOrders.map((order) => (
                        <tr key={order.buy_order_id} className="border-t">
                          <td className="p-2">{order.buy_order_id}</td>
                          <td className="p-2 text-right">${order.price_bid}</td>
                          <td className="p-2 text-right">{order.contracts_bid}</td>
                          <td className="p-2 text-right">{order.created_utc.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            <div className="w-full">
              <h2 className="text-lg font-semibold mb-4">Sell Orders</h2>
              <div className="overflow-y-auto max-h-[300px]">
                {!selectedContractId ? (
                  <div className="text-center text-gray-500 py-4">
                    Select a contract to view sell orders
                  </div>
                ) : isLoadingOrders ? (
                  <div className="text-center py-4">Loading sell orders...</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white">
                      <tr>
                        <th className="text-left p-2">Order ID</th>
                        <th className="text-right p-2">Price</th>
                        <th className="text-right p-2">Contracts</th>
                        <th className="text-right p-2">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellOrders.map((order) => (
                        <tr key={order.sell_order_id} className="border-t">
                          <td className="p-2">{order.sell_order_id}</td>
                          <td className="p-2 text-right">${order.price_asked}</td>
                          <td className="p-2 text-right">{order.contracts_asked}</td>
                          <td className="p-2 text-right">{order.created_utc.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
