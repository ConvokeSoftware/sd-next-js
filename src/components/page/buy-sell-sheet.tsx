import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
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
  const [price, setPrice] = React.useState('');
  const [contracts, setContracts] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = React.useState<any>(null);

  React.useEffect(() => {
    if (!open) {
      setPrice('');
      setContracts('');
      setResult(null);
    }
  }, [open]);

  const handleBuy = async () => {
    if (!userId || !contract) return;
    setLoading(true);
    setResult(null);
    try {
      console.log('handleBuy', userId, contract.contract_id, price, contracts);
      const report = await executeBuyOrder(
        userId,
        contract.contract_id,
        Number(price),
        Number(contracts)
      );
      setResult(report);
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    if (!userId || !contract) return;
    setLoading(true);
    setResult(null);
    try {
      console.log('handleSell', userId, contract.contract_id, price, contracts);
      const report = await executeSellOrder(
        userId,
        contract.contract_id,
        Number(price),
        Number(contracts)
      );
      setResult(report);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="max-w-md w-full bg-background p-8 rounded-xl flex flex-col justify-center shadow-xl border border-zinc-200"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold mb-2">
            {actionType ? actionType.charAt(0).toUpperCase() + actionType.slice(1) : ''} Order
          </SheetTitle>
          <SheetDescription>
            {contract ? (
              <div>
                <div className="font-bold text-lg">{contract.team_name}</div>
                <div className="text-sm text-muted-foreground">
                  Contract ID: {contract.contract_id}
                </div>
              </div>
            ) : (
              'No contract selected.'
            )}
          </SheetDescription>
        </SheetHeader>
        <form className="mt-8 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <input
            type="number"
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Number of Contracts"
            value={contracts}
            onChange={(e) => setContracts(e.target.value)}
          />
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              className="w-full rounded-md bg-blue-600 text-white font-semibold py-2 hover:bg-blue-700 transition"
              onClick={handleBuy}
              disabled={loading}
            >
              {loading && actionType === 'buy' ? 'Processing...' : 'Buy'}
            </button>
            <button
              type="button"
              className="w-full rounded-md bg-zinc-200 text-zinc-900 font-semibold py-2 hover:bg-zinc-300 transition"
              onClick={handleSell}
              disabled={loading}
            >
              {loading && actionType === 'sell' ? 'Processing...' : 'Sell'}
            </button>
          </div>
          {result && (
            <div className="mt-4 p-3 rounded bg-zinc-100 text-sm text-zinc-800 whitespace-pre-wrap">
              {typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}
            </div>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
