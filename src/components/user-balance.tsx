'use client';
import { fetchAllUsers, fetchUserOpenProfitLossTotal } from '@/actions/actions';
import { User } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function UserBalance() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openProfitLoss, setOpenProfitLoss] = useState<number | null>(null);

  // Get userId from query param, or fallback to first user
  const userIdFromQuery = Number(searchParams.get('user'));
  const userId = userIdFromQuery || (users.length > 0 ? users[0].user_id : undefined);

  // When users load, if no userId in query param, set it to the first user
  useEffect(() => {
    if (users.length > 0 && !userIdFromQuery) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set('user', users[0].user_id.toString());
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [users, userIdFromQuery, searchParams, router]);

  // Load users and set selected user
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      const usersData = await fetchAllUsers();
      setUsers(usersData);
      setIsLoading(false);
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0 && userId) {
      setUser(users.find((u) => u.user_id === userId) || null);
    }
  }, [users, userId]);

  // Fetch open profit/loss when userId changes
  useEffect(() => {
    const loadOpenProfitLoss = async () => {
      if (!userId) {
        setOpenProfitLoss(null);
        return;
      }
      const openProfitLossSum = await fetchUserOpenProfitLossTotal(userId);
      setOpenProfitLoss(openProfitLossSum);
    };
    loadOpenProfitLoss();
  }, [userId]);

  return (
    <div className="flex-1 flex justify-evenly items-center">
      <div className="text-sm">
        <span className="text-muted-foreground">Balance:</span>
        <span className="ml-1 font-medium">
          {isLoading ? '...' : user ? `$${user.balance}` : 'N/A'}
        </span>
      </div>
      <div className="text-sm">
        <span className="text-muted-foreground">Open P/L:</span>
        <span
          className={`ml-1 font-medium ${openProfitLoss === null ? '' : openProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          {openProfitLoss === null
            ? '...'
            : `$${openProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </span>
      </div>
      <div className="text-sm bg-red-200">
        <span className="text-muted-foreground">Equity:</span>
        <span className="ml-1 font-medium">C$8,709.45</span>
      </div>
      <div className="text-sm bg-red-200">
        <span className="text-muted-foreground">Used Margin:</span>
        <span className="ml-1 font-medium">C$8,068.71</span>
      </div>
      <div className="text-sm bg-red-200">
        <span className="text-muted-foreground">Available Margin:</span>
        <span className="ml-1 font-medium">C$640.74</span>
      </div>
      <div className="text-sm bg-red-200">
        <span className="text-muted-foreground">Margin Level:</span>
        <span className="ml-1 font-medium">107.94%</span>
      </div>
    </div>
  );
}
