'use client';

import { useEffect, useState } from 'react';
import { fetchUserContractTransactions } from '@/actions/actions';
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

export function UserContractTransactions() {
  const [transactions, setTransactions] = useState<ContractTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  // Accept both userId/contractId and user/contract as query params
  const contractId = searchParams.get('contractId') || searchParams.get('contract');
  const userId = searchParams.get('userId') || searchParams.get('user');

  useEffect(() => {
    const loadTransactions = async () => {
      // Only load if we have both userId and contractId
      if (!userId || !contractId) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchUserContractTransactions(parseInt(userId), parseInt(contractId));
        setTransactions(data);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [userId, contractId]);

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
