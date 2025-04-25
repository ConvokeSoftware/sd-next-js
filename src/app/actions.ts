'use server';

import { getNFLWinContracts } from '@/lib/db';
import type { NFLWinContract } from '@/lib/db';

export async function fetchNFLContracts(): Promise<NFLWinContract[]> {
  const contracts = await getNFLWinContracts();
  return contracts.sort((a, b) => a.contract_id - b.contract_id);
}
