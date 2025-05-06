import { Card } from '@/components/ui/card';
import { User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { fetchAllUsers, fetchOpenProfitLossSum } from '@/actions/actions';

interface BalanceProps {
  selectedUserId: number;
  onUserSelect: (userId: number) => void;
}

export function Balance({ selectedUserId, onUserSelect }: BalanceProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openProfitLossSum, setOpenProfitLossSum] = useState<number>(0);
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const usersData = await fetchAllUsers();
        setUsers(usersData);

        // Find and set the selected user
        const user = usersData.find((u) => u.user_id === selectedUserId);
        if (user) {
          setSelectedUser(user);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadOpenProfitLossSum = async () => {
      const openProfitLossSum = await fetchOpenProfitLossSum(selectedUserId);
      setOpenProfitLossSum(openProfitLossSum);
    };

    loadUsers();
    loadOpenProfitLossSum();
  }, [selectedUserId]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = parseInt(e.target.value);
    onUserSelect(userId);

    // Update the selected user in this component
    const user = users.find((u) => u.user_id === userId);
    if (user) {
      setSelectedUser(user);
    }
  };

  return (
    <Card className="p-4 col-span-12">
      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="user-select" className="text-sm font-medium">
            Select User:
          </label>
          <select
            id="user-select"
            className="p-2 border rounded-md"
            value={selectedUserId}
            onChange={handleUserChange}
            disabled={isLoading}
          >
            {users
              .sort((a, b) => a.user_id - b.user_id)
              .map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  User {user.user_id}
                </option>
              ))}
          </select>
        </div>

        {isLoading ? (
          <div>Loading user data...</div>
        ) : selectedUser ? (
          <div className="flex flex-row gap-2">
            <div className="text-lg font-medium">Balance: ${selectedUser.balance}</div>
            <div className="text-lg font-medium">Open P/L: ${openProfitLossSum}</div>
          </div>
        ) : (
          <div className="text-gray-500">User not found</div>
        )}
      </div>
    </Card>
  );
}
