'use client';

import { fetchUserContractSummary } from '@/actions/actions';
import { UserContractSummary } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Positions() {
  const searchParams = useSearchParams();
  const [position, setPosition] = useState<UserContractSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userParam = searchParams.get('user');
  const contractParam = searchParams.get('contract');
  const userId = userParam ? Number(userParam) : undefined;
  const contractId = contractParam ? Number(contractParam) : undefined;

  useEffect(() => {
    if (!userId || !contractId) return;
    const loadPosition = async () => {
      try {
        setIsLoading(true);
        const positionData = await fetchUserContractSummary(userId, contractId);
        setPosition(positionData);
      } catch (error) {
        console.error('Failed to fetch position:', error);
        setPosition(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosition();
  }, [contractId, userId]);

  if (!userParam || !contractParam) {
    // Wait for params to be set (e.g., by UserBalance)
    return <div className="px-2 h-48 flex items-center justify-center">Loading...</div>;
  }

  if (!userId || !contractId) {
    // Params are present but invalid
    return (
      <div className="px-2 h-48">
        <div className="text-center text-muted-foreground">
          Select a contract and user to view positions
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-2 h-48">
        <div className="text-center">Loading position data...</div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="px-2 h-48">
        <div className="text-center text-muted-foreground">No position found for this contract</div>
      </div>
    );
  }

  return (
    <div className="px-2 h-48">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">Position Summary</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 rounded-md bg-muted">
              <span className="text-sm">Net Contracts</span>
              <span className="font-medium">{position.net_contracts}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-muted">
              <span className="text-sm">Net Cashflow</span>
              <span className="font-medium">${position.net_cashflow}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-muted">
              <span className="text-sm">Average Price</span>
              <span className="font-medium">${position.average_price_per_contract}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 rounded-md bg-muted">
              <span className="text-sm">Last Price</span>
              <span className="font-medium">${position.last_price}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-muted">
              <span className="text-sm">Current Value</span>
              <span className="font-medium">${position.current_value}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-muted">
              <span className="text-sm">Net P/L</span>
              <span
                className={`font-medium ${position.net_profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                ${position.net_profit_loss}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
