import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Contracts, LastTradePrice } from '@/lib/types';

interface ContractsListProps {
  contracts: Contracts[];
  lastTradePrices: Record<number, LastTradePrice>;
  selectedContractId: number | null;
  isLoading: boolean;
  onContractSelect: (contractId: number) => void;
}

export function ContractsList({
  contracts,
  lastTradePrices,
  selectedContractId,
  isLoading,
  onContractSelect,
}: ContractsListProps) {
  return (
    <Card className="h-full p-4 flex flex-col overflow-hidden">
      <h2 className="text-lg font-semibold mb-4">Contracts</h2>
      <div className="grid grid-cols-1 gap-2 overflow-y-auto">
        {isLoading ? (
          <div className="col-span-2 text-center py-4">Loading Contracts...</div>
        ) : (
          contracts.map((contract) => (
            <Card
              key={contract.contract_id}
              className={`p-4 cursor-pointer transition-colors hover:bg-gray-100 flex flex-col gap-2 ${
                selectedContractId === contract.contract_id ? 'bg-blue-100 hover:bg-blue-100' : ''
              }`}
              onClick={() => onContractSelect(contract.contract_id)}
            >
              <div className="flex flex-row text-sm text-gray-500 justify-between">
                <div className="font-bold">{contract.contract_id}</div>
                <span>
                  {contract.team_name} ( {contract.abbreviation} )
                </span>
                <span>{contract.league}</span>
              </div>
              <span className="text-sm text-gray-600">{contract.measurable}</span>
              <div className="flex flex-row justify-between items-center">
                <Image
                  src={`/images/nfl_team_images/${contract.contract_id}.png`}
                  alt={contract.abbreviation}
                  width={48}
                  height={48}
                />
                <div className="text-lg text-gray-600">
                  {lastTradePrices[contract.contract_id]
                    ? `$${lastTradePrices[contract.contract_id].last_price}`
                    : 'No price data'}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
}
