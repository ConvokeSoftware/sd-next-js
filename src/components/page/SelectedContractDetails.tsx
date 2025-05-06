'use client';
import { Card } from '@/components/ui/card';
import {
  Contracts,
  LastTradePrice,
  LastTradePriceWith7DaysChange,
  UserContractSummary,
} from '@/lib/types';
import { useEffect, useState } from 'react';
import { fetchUserContractSummary } from '@/actions/actions';

interface SelectedContractDetailsProps {
  selectedContractId: number | null;
  contract: Contracts;
  lastTradePrices: Record<number, LastTradePrice>;
  lastTradePricesWith7DaysChange: Record<number, LastTradePriceWith7DaysChange>;
  selectedUserId: number;
}

export function SelectedContractDetails({
  selectedContractId,
  contract,
  lastTradePrices,
  lastTradePricesWith7DaysChange,
  selectedUserId,
}: SelectedContractDetailsProps) {
  const [userSummary, setUserSummary] = useState<UserContractSummary | null>(null);

  useEffect(() => {
    async function loadSummary() {
      if (selectedContractId && selectedUserId) {
        const summary = await fetchUserContractSummary(selectedUserId, selectedContractId);
        setUserSummary(summary);
      } else {
        setUserSummary(null);
      }
    }
    loadSummary();
  }, [selectedContractId, selectedUserId]);

  return (
    <Card className="p-4">
      {selectedContractId ? (
        <>
          <div className="flex flex-row items-center gap-4">
            {/* Team and Contract ID */}
            <div className="flex flex-row gap-4 items-center">
              <div className="text-xl font-semibold">{contract.abbreviation}</div>
              <div className="text-sm text-gray-600">ID: {selectedContractId}</div>
              <div className="text-sm text-gray-600">
                {contract.team_name} - {contract.league} - {contract.measurable}
              </div>
            </div>

            {/* Current Price */}
            {lastTradePrices[selectedContractId] && (
              <div className="text-xl font-semibold">
                ${lastTradePrices[selectedContractId].last_price}
              </div>
            )}

            {/* Additional Information */}
            {lastTradePrices[selectedContractId] &&
              lastTradePricesWith7DaysChange[selectedContractId] && (
                <div className="flex flex-row gap-4 items-center text-sm text-gray-600">
                  <div>Vol: {lastTradePrices[selectedContractId].last_volume}</div>
                  <div>
                    Updated:{' '}
                    {new Date(lastTradePrices[selectedContractId].last_utc).toLocaleString()}
                  </div>
                  <div
                    className={
                      lastTradePricesWith7DaysChange[selectedContractId].price_change_7d > 0
                        ? 'text-green-600'
                        : lastTradePricesWith7DaysChange[selectedContractId].price_change_7d < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }
                  >
                    7d:{' '}
                    {lastTradePricesWith7DaysChange[selectedContractId].price_change_7d > 0
                      ? '+'
                      : ''}
                    {lastTradePricesWith7DaysChange[selectedContractId].price_change_7d}
                  </div>
                  <div>
                    7d Vol:{' '}
                    {lastTradePricesWith7DaysChange[selectedContractId].volume_7d.toLocaleString()}
                  </div>
                </div>
              )}
          </div>

          {/* User Contract Summary Table (always show) */}
          <div className="mt-4">
            <table className="min-w-full text-sm border rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Net Contracts</th>
                  <th className="p-2 text-left">Net Cashflow</th>
                  <th className="p-2 text-left">Avg Price/Contract</th>
                  <th className="p-2 text-left">Last Price</th>
                  <th className="p-2 text-left">Current Value</th>
                  <th className="p-2 text-left">Net P/L</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">{userSummary ? userSummary.net_contracts : 'N/A'}</td>
                  <td className="p-2">{userSummary ? userSummary.net_cashflow : 'N/A'}</td>
                  <td className="p-2">
                    {userSummary ? userSummary.average_price_per_contract : 'N/A'}
                  </td>
                  <td className="p-2">{userSummary ? userSummary.last_price : 'N/A'}</td>
                  <td className="p-2">{userSummary ? userSummary.current_value : 'N/A'}</td>
                  <td className="p-2">{userSummary ? userSummary.net_profit_loss : 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div>No contract selected</div>
      )}
    </Card>
  );
}
