'use client';

import { fetchContractBuyOrders, fetchContractSellOrders } from '@/actions/actions';
import { Card } from '@/components/ui/card';
import { ContractBuyOrder, ContractSellOrder } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function OrderBook() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [buyOrders, setBuyOrders] = useState<ContractBuyOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<ContractSellOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [contractId, setContractId] = useState<number | null>(null);

  useEffect(() => {
    const contractId = Number(searchParams.get('contract'));
    console.log('contract', contractId);
    setContractId(contractId);
  }, [searchParams, router]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!contractId) {
        setBuyOrders([]);
        setSellOrders([]);
        return;
      }

      try {
        setIsLoading(true);
        const [buyOrders, sellOrders] = await Promise.all([
          fetchContractBuyOrders(contractId),
          fetchContractSellOrders(contractId),
        ]);

        // Sort buy orders by price (highest to lowest)
        const sortedBuyOrders = [...buyOrders].sort((a, b) => b.price_bid - a.price_bid);
        // Sort sell orders by price (lowest to highest)
        const sortedSellOrders = [...sellOrders].sort((a, b) => a.price_asked - b.price_asked);

        setBuyOrders(sortedBuyOrders);
        setSellOrders(sortedSellOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setBuyOrders([]);
        setSellOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [contractId]);

  if (!contractId) {
    return (
      <Card className="p-4">
        <div className="text-center text-muted-foreground">
          Select a contract to view the order book
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-center">Loading order book...</div>
      </Card>
    );
  }

  return (
    <div className="px-2 h-48">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {buyOrders.length + sellOrders.length} total orders
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 overflow-hidden">
          {/* Buy Orders */}
          <div className="overflow-hidden">
            <h3 className="text-sm font-medium mb-2 text-green-600 dark:text-green-400">
              Buy Orders
            </h3>
            <div className="space-y-1 overflow-y-auto max-h-[calc(12rem-4rem)]">
              {buyOrders.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-2">No buy orders</div>
              ) : (
                buyOrders.map((order) => (
                  <div
                    key={order.buy_order_id}
                    className="flex justify-between items-center text-sm p-2 rounded-md bg-green-50 dark:bg-green-950/20"
                  >
                    <span className="font-medium">${order.price_bid}</span>
                    <span className="text-muted-foreground">{order.contracts_bid} contracts</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sell Orders */}
          <div className="overflow-hidden">
            <h3 className="text-sm font-medium mb-2 text-red-600 dark:text-red-400">Sell Orders</h3>
            <div className="space-y-1 overflow-y-auto max-h-[calc(12rem-4rem)]">
              {sellOrders.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-2">No sell orders</div>
              ) : (
                sellOrders.map((order) => (
                  <div
                    key={order.sell_order_id}
                    className="flex justify-between items-center text-sm p-2 rounded-md bg-red-50 dark:bg-red-950/20"
                  >
                    <span className="font-medium">${order.price_asked}</span>
                    <span className="text-muted-foreground">{order.contracts_asked} contracts</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
