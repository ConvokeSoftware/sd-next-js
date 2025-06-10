import * as React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { executeBuyOrder, executeSellOrder } from '@/actions/actions';

interface BuySellSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contract: any;
  actionType: 'buy' | 'sell' | null;
  userId: number | null;
}

export function BuySellSheet({
  open,
  onOpenChange,
  contract,
  actionType,
  userId,
}: BuySellSheetProps) {
  const [amount, setAmount] = React.useState('1,000');
  const [direction, setDirection] = React.useState<'buy' | 'sell'>(actionType || 'buy');
  const [stopLoss, setStopLoss] = React.useState(false);
  const [takeProfit, setTakeProfit] = React.useState(false);
  const [price, setPrice] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = React.useState<any>(null);

  React.useEffect(() => {
    if (!open) {
      setAmount('1,000');
      setDirection(actionType || 'buy');
      setStopLoss(false);
      setTakeProfit(false);
      setPrice('');
      setResult(null);
    }
  }, [open, actionType]);

  const handleTrade = async () => {
    if (!userId || !contract) return;
    setLoading(true);
    setResult(null);
    try {
      const numericAmount = Number(amount.replace(/,/g, ''));
      const numericPrice = Number(price) || 0;
      console.log(
        `handle${direction.charAt(0).toUpperCase() + direction.slice(1)}`,
        userId,
        contract.contract_id,
        numericPrice,
        numericAmount
      );

      const report =
        direction === 'buy'
          ? await executeBuyOrder(userId, contract.contract_id, numericPrice, numericAmount)
          : await executeSellOrder(userId, contract.contract_id, numericPrice, numericAmount);

      setResult(report);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (value: string) => {
    const numeric = value.replace(/[^0-9]/g, '');
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);
    setAmount(formatted);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-md w-full bg-white p-0 shadow-xl border-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">🏈</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {contract?.team_name || 'Contract'}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-medium">
              TRADE
            </button>
            <button className="px-4 py-2 text-gray-600 rounded-md text-sm font-medium">
              ORDER
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Amount Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs">
                ?
              </span>
              <span>Amount:</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <span className="text-sm text-gray-600">Lot = {amount} USD</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs">
                ?
              </span>
              <span>Price:</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Free Margin Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs">
              ?
            </span>
            <span>
              With your free margin, maximum trade can be up to:{' '}
              <span className="text-blue-600 font-semibold">142,000</span>
            </span>
          </div>

          {/* Direction Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs">
                ?
              </span>
              <span>Direction:</span>
            </div>
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <button
                onClick={() => setDirection('sell')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  direction === 'sell'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className="font-bold">SELL</div>
                  <div className="text-xs text-gray-500">1.14161</div>
                </div>
              </button>
              <button
                onClick={() => setDirection('buy')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  direction === 'buy'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className="font-bold">BUY</div>
                  <div className="text-xs opacity-75">1.14186</div>
                </div>
              </button>
            </div>
          </div>

          {/* Stop Loss */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs">
                  ?
                </span>
                <span>Stop Loss</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStopLoss(!stopLoss)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    stopLoss ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${
                      stopLoss ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <span className="text-sm text-blue-600 underline cursor-pointer">
                  Trailing Stop
                </span>
              </div>
            </div>
          </div>

          {/* Take Profit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs">
                  ?
                </span>
                <span>Take Profit</span>
              </div>
              <button
                onClick={() => setTakeProfit(!takeProfit)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  takeProfit ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${
                    takeProfit ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Trade Summary */}
          <div className="text-center text-sm text-gray-700 py-4">
            You are about to <span className="font-semibold">{direction.toUpperCase()}</span>{' '}
            {contract?.team_name || 'Contract'} in the amount of{' '}
            <span className="font-semibold">{amount} USD</span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleTrade}
            disabled={loading}
            className={`w-full py-4 rounded-md text-white font-semibold text-lg transition-colors ${
              direction === 'buy' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : `${direction.toUpperCase()} NOW`}
          </button>

          {/* Result Display */}
          {result && (
            <div className="mt-4 p-4 rounded-md bg-gray-50 text-sm text-gray-800 whitespace-pre-wrap">
              {typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
