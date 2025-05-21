'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchAllUsers } from '@/actions/actions';
import { User } from '@/lib/types';

export function TempUserControl() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedUserId = Number(searchParams.get('user')) || users[0]?.user_id || 0;

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      const usersData = await fetchAllUsers();
      setUsers(usersData);
      setIsLoading(false);
    };
    loadUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('user', userId);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <select
      className="p-2 border rounded-md text-sm bg-background"
      value={selectedUserId}
      onChange={handleChange}
      disabled={isLoading}
      style={{ minWidth: 80 }}
    >
      {users.map((user) => (
        <option key={user.user_id} value={user.user_id}>
          User {user.user_id}
        </option>
      ))}
    </select>
  );
}
