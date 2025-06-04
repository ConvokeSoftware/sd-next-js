import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface BuySellSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contract: any;
  actionType: 'buy' | 'sell' | null;
}

export function BuySellSheet({ open, onOpenChange, contract, actionType }: BuySellSheetProps) {
  const [price, setPrice] = React.useState('');
  const [contracts, setContracts] = React.useState('');

  React.useEffect(() => {
    if (!open) {
      setPrice('');
      setContracts('');
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-w-lg mx-auto">
        <SheetHeader>
          <SheetTitle>
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
        <div className="mt-6 flex flex-col gap-4">
          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Number of Contracts"
            value={contracts}
            onChange={(e) => setContracts(e.target.value)}
          />
          <div className="flex gap-4 mt-2">
            <button className="btn btn-primary w-full">Buy</button>
            <button className="btn btn-secondary w-full">Sell</button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
