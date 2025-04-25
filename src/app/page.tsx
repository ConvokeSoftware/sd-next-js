'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import type { NFLWinContract } from '@/lib/db';
import { fetchNFLContracts } from './actions';

export default function Home() {
  const [contracts, setContracts] = useState<NFLWinContract[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        setIsLoading(true);
        const nflContracts = await fetchNFLContracts();
        setContracts(nflContracts);
      } catch (error) {
        console.error('Failed to fetch contracts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContracts();
  }, []);

  return (
    <main className="h-[100dvh] p-4 flex flex-col w-full overflow-hidden">
      <div className="grid grid-cols-12 gap-4 flex-grow overflow-hidden">
        {/* Markets Column - Left Side */}
        <div className="col-span-3 overflow-hidden">
          <Card className="h-full p-4 flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold mb-4">Markets</h2>
            <div className="grid grid-cols-1 gap-2 overflow-y-auto">
              {isLoading ? (
                <div className="col-span-2 text-center py-4">Loading markets...</div>
              ) : (
                contracts.map((contract) => (
                  <Card
                    key={contract.contract_id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-100 ${
                      selectedContractId === contract.contract_id
                        ? 'bg-blue-100 hover:bg-blue-100'
                        : ''
                    }`}
                    onClick={() => setSelectedContractId(contract.contract_id)}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold">{contract.contract_id}</div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Main Content Column - Right Side */}
        <div className="col-span-9 space-y-4 overflow-y-auto">
          {/* Balance Row */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Balance</h2>
            {/* Balance content will go here */}
          </Card>

          {/* Selected Row */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Selected</h2>
            {selectedContractId ? (
              <div>Selected Contract: {selectedContractId}</div>
            ) : (
              <div>No contract selected</div>
            )}
          </Card>

          {/* Graph and Buy/Sell Row */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Graph</h2>
              {/* Graph content will go here */}
            </Card>
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Buy/Sell</h2>
              {/* Buy/Sell content will go here */}
            </Card>
          </div>

          {/* Orders Row */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Orders</h2>
            {/* Orders content will go here */}
          </Card>
        </div>
      </div>
    </main>
  );
}
