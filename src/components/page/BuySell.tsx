'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { executeBuyOrder, executeSellOrder } from '@/actions/actions';

// Commented out imports for market orders and other features
/*
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';
import { fetchBuyOrdersSummary, fetchSellOrdersSummary, fetchAllUsers } from '@/app/actions';
import { GetBuyOrdersSummary, GetSellOrdersSummary } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
*/

interface BuySellProps {
  className?: string;
  contractId: number;
  selectedUserId: number;
}

// Commented out interface for market orders
/*
interface OrderBreakdown {
  price: number;
  contracts: number;
}
*/

export function BuySell({ className, contractId, selectedUserId }: BuySellProps) {
  // Active states for limit orders
  const [selectedAction, setSelectedAction] = useState<'BUY' | 'SELL'>('BUY');
  const [price, setPrice] = useState<string>('');
  const [contracts, setContracts] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Commented out states for market orders and other features
  /*
  const [buyOrdersSummary, setBuyOrdersSummary] = useState<GetBuyOrdersSummary[]>([]);
  const [sellOrdersSummary, setSellOrdersSummary] = useState<GetSellOrdersSummary[]>([]);
  const [amount, setAmount] = useState<string>('0');
  const [maxTrade, setMaxTrade] = useState<number>(0);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [orderBreakdown, setOrderBreakdown] = useState<OrderBreakdown[]>([]);
  const [showTables, setShowTables] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(true);
  */

  // Commented out effects for market orders
  /*
  useEffect(() => {
    const fetchData = async () => {
      const [buyOrders, sellOrders] = await Promise.all([
        fetchBuyOrdersSummary(contractId),
        fetchSellOrdersSummary(contractId),
      ]);
      setBuyOrdersSummary(buyOrders);
      setSellOrdersSummary(sellOrders);
    };
    fetchData();
  }, [contractId]);

  useEffect(() => {
    const fetchUser = async () => {
      const users = await fetchAllUsers();
      const user = users.find((u) => u.user_id === selectedUserId);
      if (user) {
        setUserBalance(user.balance);
      } else {
        setUserBalance(0);
      }
    };
    fetchUser();
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedAction === 'BUY' && sellOrdersSummary.length > 0) {
      const availableOrders = sellOrdersSummary.sort((a, b) => a.price_asked - b.price_asked);
      let remainingBalance = userBalance;
      let totalContracts = 0;
      const breakdown: OrderBreakdown[] = [];

      for (const order of availableOrders) {
        if (remainingBalance <= 0) break;
        const maxContractsAtThisPrice = Math.floor(remainingBalance / order.price_asked);
        const contractsToTake = Math.min(maxContractsAtThisPrice, order.total_available_contracts);
        if (contractsToTake > 0) {
          breakdown.push({
            price: order.price_asked,
            contracts: contractsToTake,
          });
          totalContracts += contractsToTake;
          remainingBalance -= contractsToTake * order.price_asked;
        }
      }
      setMaxTrade(totalContracts);
      setOrderBreakdown(breakdown);
    } else if (selectedAction === 'SELL' && buyOrdersSummary.length > 0) {
      const availableOrders = buyOrdersSummary.sort((a, b) => b.price_bid - a.price_bid);
      let remainingBalance = userBalance;
      let totalContracts = 0;
      const breakdown: OrderBreakdown[] = [];

      for (const order of availableOrders) {
        if (remainingBalance <= 0) break;
        const maxContractsAtThisPrice = Math.floor(remainingBalance / order.price_bid);
        const contractsToTake = Math.min(maxContractsAtThisPrice, order.total_available_contracts);
        if (contractsToTake > 0) {
          breakdown.push({
            price: order.price_bid,
            contracts: contractsToTake,
          });
          totalContracts += contractsToTake;
          remainingBalance -= contractsToTake * order.price_bid;
        }
      }
      setMaxTrade(totalContracts);
      setOrderBreakdown(breakdown);
    } else {
      setMaxTrade(0);
      setOrderBreakdown([]);
    }
  }, [userBalance, buyOrdersSummary, sellOrdersSummary, selectedAction]);
  */

  const handleTrade = async () => {
    try {
      setIsLoading(true);
      if (!selectedUserId || !contractId || !price || !contracts) {
        console.log('Please fill in all required fields');
        return;
      }

      const priceNum = parseFloat(price);
      const contractsNum = parseInt(contracts);

      if (priceNum <= 0 || contractsNum <= 0) {
        console.log('Price and contracts must be greater than 0');
        return;
      }

      const success = await (selectedAction === 'BUY'
        ? executeBuyOrder(selectedUserId, contractId, priceNum, contractsNum)
        : executeSellOrder(selectedUserId, contractId, priceNum, contractsNum));

      if (success) {
        console.log(`${selectedAction} order placed successfully`);
        setPrice('');
        setContracts('');
      } else {
        console.log(`Failed to place ${selectedAction} order`);
      }
    } catch (error) {
      console.error(`Error placing ${selectedAction} order:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn('p-4 space-y-4', className)}>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={selectedAction === 'SELL' ? 'default' : 'outline'}
          onClick={() => setSelectedAction('SELL')}
        >
          SELL
        </Button>
        <Button
          variant={selectedAction === 'BUY' ? 'default' : 'outline'}
          onClick={() => setSelectedAction('BUY')}
        >
          BUY
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Price:</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Contracts:</label>
          <Input
            type="number"
            min="0"
            step="1"
            value={contracts}
            onChange={(e) => setContracts(e.target.value)}
            placeholder="Enter number of contracts"
          />
        </div>

        <Button
          className="w-full"
          size="lg"
          variant={selectedAction === 'BUY' ? 'default' : 'destructive'}
          disabled={isLoading || !price || !contracts}
          onClick={handleTrade}
        >
          {isLoading ? 'Processing...' : `Place ${selectedAction} Order`}
        </Button>
      </div>

      {/* Commented out market order UI components
      <div className="grid grid-cols-2 gap-4">
        <div>
          {showTables && (
            <>
              <div>Sell Contracts</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Contracts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellOrdersSummary.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-right text-red-500">{order.price_asked}</TableCell>
                      <TableCell className="text-right">
                        {order.total_available_contracts}
                      </TableCell>
                    </TableRow>
                  ))}
                  {sellOrdersSummary.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-gray-500">
                        No sell orders
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </div>

        <div>
          {showTables && (
            <>
              <div>Buy Contracts</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Contracts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyOrdersSummary.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-right text-green-500">{order.price_bid}</TableCell>
                      <TableCell className="text-right">
                        {order.total_available_contracts}
                      </TableCell>
                    </TableRow>
                  ))}
                  {buyOrdersSummary.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-gray-500">
                        No buy orders
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full mt-2"
        onClick={() => setShowTables(!showTables)}
      >
        {showTables ? 'Hide Order Tables' : 'Show Order Tables'}
      </Button>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 font-medium">Stop Loss</div>
          <Switch disabled />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">Trailing Stop</div>
          <Switch disabled />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 font-medium">Take Profit</div>
          <Switch disabled />
        </div>
      </div>
      */}
    </Card>
  );
}
