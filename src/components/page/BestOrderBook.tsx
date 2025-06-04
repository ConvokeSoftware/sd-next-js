import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchBuyOrdersBestAvail, fetchSellOrdersBestAvail } from '@/actions/actions';
import { BestBuyOrder, BestSellOrder } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export function BestOrderBook() {
  const searchParams = useSearchParams();
  const contractId = searchParams.get('contractId') || searchParams.get('contract');

  const [buyOrders, setBuyOrders] = useState<BestBuyOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<BestSellOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState('buy');

  useEffect(() => {
    if (!contractId) {
      setBuyOrders([]);
      setSellOrders([]);
      return;
    }
    const load = async () => {
      setIsLoading(true);
      try {
        const [buy, sell] = await Promise.all([
          fetchBuyOrdersBestAvail(Number(contractId)),
          fetchSellOrdersBestAvail(Number(contractId)),
        ]);
        setBuyOrders(buy);
        setSellOrders(sell);
      } catch (err) {
        console.error(err);
        setBuyOrders([]);
        setSellOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [contractId]);

  if (!contractId) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Select a contract to view the best order book
      </div>
    );
  }

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="mb-2">
        <TabsTrigger value="buy">Best Buy Orders</TabsTrigger>
        <TabsTrigger value="sell">Best Sell Orders</TabsTrigger>
      </TabsList>
      <TabsContent value="buy">
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Price Bid</TableHead>
                <TableHead>Total Available Contracts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buyOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No buy orders
                  </TableCell>
                </TableRow>
              ) : (
                buyOrders.map((order, idx) => (
                  <TableRow key={idx}>
                    <TableCell>${order.price_bid}</TableCell>
                    <TableCell>{order.total_available_contracts}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TabsContent>
      <TabsContent value="sell">
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Price Ask</TableHead>
                <TableHead>Total Available Contracts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No sell orders
                  </TableCell>
                </TableRow>
              ) : (
                sellOrders.map((order, idx) => (
                  <TableRow key={idx}>
                    <TableCell>${order.price_asked}</TableCell>
                    <TableCell>{order.total_available_contracts}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TabsContent>
    </Tabs>
  );
}
