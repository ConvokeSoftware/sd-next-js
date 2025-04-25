import { Card } from '@/components/ui/card';
import { LastTradePrice100 } from '@/lib/types';

interface HistoricalDataProps {
  lastTradePricesX100: LastTradePrice100[];
  isLoadingHistoricalData: boolean;
  selectedContractId: number | null;
}

export function HistoricalData({
  lastTradePricesX100,
  isLoadingHistoricalData,
  selectedContractId,
}: HistoricalDataProps) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Graph</h2>
      <div className="text-sm text-gray-600 mb-2">
        Note: This data will be used to populate graph points
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
        {isLoadingHistoricalData ? (
          <div className="text-center py-4">Loading historical data...</div>
        ) : lastTradePricesX100.length > 0 ? (
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="text-left p-2">Time</th>
                <th className="text-right p-2">Price</th>
                <th className="text-right p-2">Volume</th>
              </tr>
            </thead>
            <tbody>
              {lastTradePricesX100.map((price, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2 text-sm">{new Date(price.last_utc).toLocaleString()}</td>
                  <td className="p-2 text-right text-sm">${price.last_price}</td>
                  <td className="p-2 text-right text-sm">{price.last_volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500">
            {selectedContractId
              ? 'No historical data available'
              : 'Select a contract to view historical data'}
          </div>
        )}
      </div>
    </Card>
  );
}
