'use client';

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

import { Balance } from '@/components/page/Balance';
import { ContractsList } from '@/components/page/ContractsList';
import { HistoricalData } from '@/components/page/HistoricalData';
import { Orders } from '@/components/page/Orders';
import { SelectedContractDetails } from '@/components/page/SelectedContractDetails';
import { Card } from '@/components/ui/card';

export default function Home() {
  const [contracts, setContracts] = useState<Contracts[]>([]);
  const [lastTradePrices, setLastTradePrices] = useState<Record<number, LastTradePrice>>({});
  const [lastTradePricesX100, setLastTradePricesX100] = useState<LastTradePrice100[]>([]);
  const [lastTradePricesWith7DaysChange, setLastTradePricesWith7DaysChange] = useState<
    Record<number, LastTradePriceWith7DaysChange>
  >({});
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
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

  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId);
  };

  return (
    <main className="h-[100dvh] p-4 flex flex-col w-full overflow-hidden">
      <div className="grid grid-cols-12 gap-4 flex-grow overflow-hidden">
        <Balance selectedUserId={selectedUserId} onUserSelect={handleUserSelect} />

        {/* Markets Column - Left Side */}
        <div className="col-span-3 overflow-hidden">
          <ContractsList
            contracts={contracts}
            lastTradePrices={lastTradePrices}
            selectedContractId={selectedContractId}
            isLoading={isLoading}
            onContractSelect={setSelectedContractId}
          />
        </div>

        {/* Main Content Column - Right Side */}
        <div className="col-span-9 space-y-4 overflow-y-auto">
          <SelectedContractDetails
            contract={contracts[selectedContractId || 0]}
            selectedContractId={selectedContractId}
            lastTradePrices={lastTradePrices}
            lastTradePricesWith7DaysChange={lastTradePricesWith7DaysChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <HistoricalData
              lastTradePricesX100={lastTradePricesX100}
              isLoadingHistoricalData={isLoadingHistoricalData}
              selectedContractId={selectedContractId}
            />
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Buy/Sell</h2>
              {/* Buy/Sell content will go here */}
            </Card>
          </div>
          <Orders
            buyOrders={buyOrders}
            sellOrders={sellOrders}
            isLoadingOrders={isLoadingOrders}
            selectedContractId={selectedContractId}
            selectedUserId={selectedUserId}
          />
        </div>
      </div>
    </main>
  );
}
