import { Card } from '@/components/ui/card';
import { Contracts, LastTradePrice, LastTradePriceWith7DaysChange } from '@/lib/types';

interface SelectedContractDetailsProps {
  selectedContractId: number | null;
  contract: Contracts;
  lastTradePrices: Record<number, LastTradePrice>;
  lastTradePricesWith7DaysChange: Record<number, LastTradePriceWith7DaysChange>;
}

export function SelectedContractDetails({
  selectedContractId,
  contract,
  lastTradePrices,
  lastTradePricesWith7DaysChange,
}: SelectedContractDetailsProps) {
  return (
    <Card className="p-4">
      {selectedContractId ? (
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
                  Updated: {new Date(lastTradePrices[selectedContractId].last_utc).toLocaleString()}
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
      ) : (
        <div>No contract selected</div>
      )}
    </Card>
  );
}
