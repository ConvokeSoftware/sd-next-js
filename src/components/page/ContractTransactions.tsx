'use client';

import { useEffect, useState } from 'react';
import { fetchContractTransactions } from '@/actions/actions';
import { ContractTransaction } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSearchParams } from 'next/navigation';

export function ContractTransactions() {
  const [transactions, setTransactions] = useState<ContractTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const contractId = searchParams.get('contractId');

  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await fetchContractTransactions(contractId ? parseInt(contractId) : undefined);
        // Sort by created_utc in descending order and take last 100
        const sortedData = data
          .sort((a, b) => new Date(b.created_utc).getTime() - new Date(a.created_utc).getTime())
          .slice(0, 100);
        setTransactions(sortedData);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [contractId]);

  if (isLoading) {
    return <div className="p-4">Loading transactions...</div>;
  }

  return (
    <div className="h-48 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.transaction_id}>
              <TableCell>{new Date(transaction.created_utc).toLocaleString()}</TableCell>
              <TableCell>{transaction.buyer_user_id}</TableCell>
              <TableCell>{transaction.seller_user_id}</TableCell>
              <TableCell>${transaction.price}</TableCell>
              <TableCell>{transaction.contracts_transacted}</TableCell>
              <TableCell>${transaction.price * transaction.contracts_transacted}</TableCell>
            </TableRow>
          ))}
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
