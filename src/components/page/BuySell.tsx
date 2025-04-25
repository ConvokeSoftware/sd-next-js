'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
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

interface BuySellProps {
  className?: string;
  contractId: number;
  selectedUserId: number;
}

interface OrderBreakdown {
  price: number;
  contracts: number;
}

export function BuySell({ className, contractId, selectedUserId }: BuySellProps) {
  const [buyOrdersSummary, setBuyOrdersSummary] = useState<GetBuyOrdersSummary[]>([]);
  const [sellOrdersSummary, setSellOrdersSummary] = useState<GetSellOrdersSummary[]>([]);
  const [amount, setAmount] = useState<string>('0');
  const [maxTrade, setMaxTrade] = useState<number>(0);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [selectedAction, setSelectedAction] = useState<'BUY' | 'SELL'>('BUY');
  const [orderBreakdown, setOrderBreakdown] = useState<OrderBreakdown[]>([]);
  const [showTables, setShowTables] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(true);

  // Fetch orders summary
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

  // Fetch user data
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

  // Calculate max trade based on user balance and available orders
  useEffect(() => {
    if (selectedAction === 'BUY' && sellOrdersSummary.length > 0) {
      // For buying, we look at sell orders (asks)
      const availableOrders = sellOrdersSummary.sort((a, b) => a.price_asked - b.price_asked); // Sort by lowest price first

      let remainingBalance = userBalance;
      let totalContracts = 0;
      const breakdown: OrderBreakdown[] = [];

      // Calculate how many contracts we can buy at each price level
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
      // For selling, we look at buy orders (bids)
      const availableOrders = buyOrdersSummary.sort((a, b) => b.price_bid - a.price_bid); // Sort by highest price first

      let remainingBalance = userBalance;
      let totalContracts = 0;
      const breakdown: OrderBreakdown[] = [];

      // Calculate how many contracts we can sell at each price level
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount(value);
  };

  const setAmountWithValidation = (value: number) => {
    // Ensure the amount doesn't exceed maxTrade
    const validatedAmount = Math.min(value, maxTrade);
    setAmount(validatedAmount.toString());
  };

  const handleTrade = () => {
    const amountNum = parseInt(amount);
    if (amountNum <= 0 || amountNum > maxTrade) {
      console.log('Invalid amount');
      return;
    }

    const tradeDetails = {
      userId: selectedUserId,
      contractId: contractId,
      action: selectedAction,
      contracts: amountNum,
      value:
        amountNum *
        (selectedAction === 'BUY'
          ? sellOrdersSummary[0]?.price_asked
          : buyOrdersSummary[0]?.price_bid),
      price:
        selectedAction === 'BUY'
          ? sellOrdersSummary[0]?.price_asked
          : buyOrdersSummary[0]?.price_bid,
      balanceBefore: userBalance,
      balanceAfter:
        userBalance -
        amountNum *
          (selectedAction === 'BUY'
            ? sellOrdersSummary[0]?.price_asked
            : buyOrdersSummary[0]?.price_bid),
      timestamp: new Date().toISOString(),
      orderBreakdown: orderBreakdown,
    };

    console.log('Trade Details:', tradeDetails);
  };

  return (
    <Card className={cn('p-4 space-y-2', className)}>
      <div className="grid grid-cols-2 gap-4">
        {/* Sell Side */}
        <div>
          <Button
            variant={selectedAction === 'SELL' ? 'default' : 'outline'}
            className="w-full mb-2"
            onClick={() => setSelectedAction('SELL')}
          >
            SELL
          </Button>
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

        {/* Buy Side */}
        <div>
          <Button
            variant={selectedAction === 'BUY' ? 'default' : 'outline'}
            className="w-full mb-2"
            onClick={() => setSelectedAction('BUY')}
          >
            BUY
          </Button>
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

      {/* Toggle Tables Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full mt-2"
        onClick={() => setShowTables(!showTables)}
      >
        {showTables ? 'Hide Order Tables' : 'Show Order Tables'}
      </Button>

      {/* Amount Input */}
      <div className="space-y-2 mt-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Amount:</div>
            <div className="flex-1">
              <Input
                type="number"
                min="0"
                max={maxTrade}
                className="w-full"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setAmountWithValidation(5)}
            >
              5
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setAmountWithValidation(10)}
            >
              10
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setAmountWithValidation(50)}
            >
              50
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setAmountWithValidation(100)}
            >
              100
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setAmountWithValidation(maxTrade)}
            >
              MAX
            </Button>
          </div>
        </div>
        {selectedAction === 'BUY' ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setShowBreakdown(!showBreakdown)}
            >
              {showBreakdown ? 'Hide Available Contracts' : 'Show Available Contracts'}
            </Button>
            {showBreakdown && (
              <div className="text-sm text-blue-500">
                You can buy a total of {maxTrade} contracts:
                <span className="text-sm text-gray-500">
                  Your balance: ${userBalance.toLocaleString()}
                </span>
                <div className="pl-2 mt-1">
                  {orderBreakdown.map((level, index) => (
                    <div key={index} className="text-gray-600">
                      • {level.contracts} contracts at ${level.price}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setShowBreakdown(!showBreakdown)}
            >
              {showBreakdown ? 'Hide Available Contracts' : 'Show Available Contracts'}
            </Button>
            {showBreakdown && (
              <div className="text-sm text-blue-500">
                You can sell a total of {maxTrade} contracts:
                <span className="text-sm text-gray-500">
                  Your balance: ${userBalance.toLocaleString()}
                </span>
                <div className="pl-2 mt-1">
                  {orderBreakdown.map((level, index) => (
                    <div key={index} className="text-gray-600">
                      • {level.contracts} contracts at ${level.price}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Stop Loss and Take Profit */}
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

      {/* Confirmation and Button */}
      <div className="space-y-4 pt-4">
        <div className="text-center text-sm">
          You are about to {selectedAction.toLowerCase()} {amount} contracts for $
          {(
            parseFloat(amount) *
              (selectedAction === 'BUY'
                ? sellOrdersSummary[0]?.price_asked
                : buyOrdersSummary[0]?.price_bid) || 0
          ).toFixed(2)}
          <br />
          Balance after trade: $
          {(
            userBalance -
            (parseFloat(amount) *
              (selectedAction === 'BUY'
                ? sellOrdersSummary[0]?.price_asked
                : buyOrdersSummary[0]?.price_bid) || 0)
          ).toFixed(2)}
        </div>
        <Button
          className="w-full"
          size="lg"
          variant={selectedAction === 'BUY' ? 'default' : 'destructive'}
          disabled={parseFloat(amount) > maxTrade || parseFloat(amount) <= 0}
          onClick={handleTrade}
        >
          {selectedAction} NOW
        </Button>
      </div>
    </Card>
  );
}
