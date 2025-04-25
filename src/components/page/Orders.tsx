import { Card } from '@/components/ui/card';
import { ContractBuyOrder, ContractSellOrder } from '@/lib/types';
import { useState } from 'react';

interface OrdersProps {
  buyOrders: ContractBuyOrder[];
  sellOrders: ContractSellOrder[];
  isLoadingOrders: boolean;
  selectedContractId: number | null;
  selectedUserId: number;
}

export function Orders({
  buyOrders,
  sellOrders,
  isLoadingOrders,
  selectedContractId,
  selectedUserId,
}: OrdersProps) {
  const [showAllOrders, setShowAllOrders] = useState(true);

  // Filter orders based on the toggle state
  const filteredBuyOrders = showAllOrders
    ? buyOrders
    : buyOrders.filter((order) => order.user_id === selectedUserId);

  const filteredSellOrders = showAllOrders
    ? sellOrders
    : sellOrders.filter((order) => order.user_id === selectedUserId);

  return (
    <Card className="p-4 flex flex-col gap-4 max-h-[300px] overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Orders</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="order-filter" className="text-sm">
            Filter:
          </label>
          <select
            id="order-filter"
            className="p-1 border rounded-md text-sm"
            value={showAllOrders ? 'all' : 'user'}
            onChange={(e) => setShowAllOrders(e.target.value === 'all')}
          >
            <option value="all">All Orders</option>
            <option value="user">My Orders</option>
          </select>
        </div>
      </div>

      <div className="flex flex-row gap-4 overflow-hidden">
        <div className="w-full">
          <h3 className="text-md font-semibold mb-2">Buy Orders</h3>
          <div className="overflow-y-auto max-h-[250px]">
            {!selectedContractId ? (
              <div className="text-center text-gray-500 py-4">
                Select a contract to view buy orders
              </div>
            ) : isLoadingOrders ? (
              <div className="text-center py-4">Loading buy orders...</div>
            ) : filteredBuyOrders.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                {showAllOrders ? 'No buy orders available' : 'No buy orders from you'}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="text-left p-2">Order ID</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Contracts</th>
                    <th className="text-right p-2">User</th>
                    <th className="text-right p-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuyOrders.map((order) => (
                    <tr key={order.buy_order_id} className="border-t">
                      <td className="p-2">{order.buy_order_id}</td>
                      <td className="p-2 text-right">${order.price_bid}</td>
                      <td className="p-2 text-right">{order.contracts_bid}</td>
                      <td className="p-2 text-right">{order.user_id}</td>
                      <td className="p-2 text-right">{order.created_utc.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="w-full">
          <h3 className="text-md font-semibold mb-2">Sell Orders</h3>
          <div className="overflow-y-auto max-h-[250px]">
            {!selectedContractId ? (
              <div className="text-center text-gray-500 py-4">
                Select a contract to view sell orders
              </div>
            ) : isLoadingOrders ? (
              <div className="text-center py-4">Loading sell orders...</div>
            ) : filteredSellOrders.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                {showAllOrders ? 'No sell orders available' : 'No sell orders from you'}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="text-left p-2">Order ID</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Contracts</th>
                    <th className="text-right p-2">User</th>
                    <th className="text-right p-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellOrders.map((order) => (
                    <tr key={order.sell_order_id} className="border-t">
                      <td className="p-2">{order.sell_order_id}</td>
                      <td className="p-2 text-right">${order.price_asked}</td>
                      <td className="p-2 text-right">{order.contracts_asked}</td>
                      <td className="p-2 text-right">{order.user_id}</td>
                      <td className="p-2 text-right">{order.created_utc.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
