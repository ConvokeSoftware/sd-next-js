'use client';

import { fetchContractBuyOrders, fetchContractSellOrders } from '@/actions/actions';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Order = {
  id: number;
  type: 'buy' | 'sell';
  price: number;
  contracts: number;
  date: Date;
  contractId: number;
};

export function History() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const userId = Number(searchParams.get('user'));
  const contractId = Number(searchParams.get('contract'));

  useEffect(() => {
    const loadOrders = async () => {
      if (!contractId) {
        setOrders([]);
        return;
      }

      try {
        setIsLoading(true);
        const [buyOrders, sellOrders] = await Promise.all([
          fetchContractBuyOrders(contractId),
          fetchContractSellOrders(contractId),
        ]);

        // Filter orders by user ID if provided
        const filteredBuyOrders = userId
          ? buyOrders.filter((order) => order.user_id === userId)
          : buyOrders;
        const filteredSellOrders = userId
          ? sellOrders.filter((order) => order.user_id === userId)
          : sellOrders;

        // Combine and format orders
        const combinedOrders: Order[] = [
          ...filteredBuyOrders.map((order) => ({
            id: order.buy_order_id,
            type: 'buy' as const,
            price: order.price_bid,
            contracts: order.contracts_bid,
            date: order.created_utc,
            contractId: order.contract_id,
          })),
          ...filteredSellOrders.map((order) => ({
            id: order.sell_order_id,
            type: 'sell' as const,
            price: order.price_asked,
            contracts: order.contracts_asked,
            date: order.created_utc,
            contractId: order.contract_id,
          })),
        ];

        // Sort by date (newest first)
        const sortedOrders = combinedOrders.sort((a, b) => b.date.getTime() - a.date.getTime());

        setOrders(sortedOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [contractId, userId]);

  if (!contractId) {
    return (
      <div className="px-2 h-48">
        <div className="text-center text-muted-foreground">
          Select a contract to view order history
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-2 h-48">
        <div className="text-center">Loading order history...</div>
      </div>
    );
  }

  return (
    <div className="px-2 h-48">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">{orders.length} total orders</div>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-y-auto max-h-[calc(12rem-4rem)]">
            {orders.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-2">No orders found</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr>
                    <th className="text-left p-2">Type</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Contracts</th>
                    <th className="text-right p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={`${order.type}-${order.id}`}
                      className={`border-t ${
                        order.type === 'buy'
                          ? 'bg-green-50 dark:bg-green-950/20'
                          : 'bg-red-50 dark:bg-red-950/20'
                      }`}
                    >
                      <td className="p-2">
                        <span
                          className={`font-medium ${
                            order.type === 'buy'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {order.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-2 text-right">${order.price}</td>
                      <td className="p-2 text-right">{order.contracts}</td>
                      <td className="p-2 text-right">{order.date.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
