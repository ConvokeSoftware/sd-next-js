'use server';

import {
  getNFLWinContracts,
  getLastTradePrices,
  getLastTradePricesX100,
  getLastTradePricesWith7DaysChange,
  getContracts,
  getContractBuyOrders,
  getContractSellOrders,
  getAllUsers,
} from '@/lib/db-helpers';
import {
  NFLWinContract,
  LastTradePrice,
  LastTradePrice100,
  LastTradePriceWith7DaysChange,
  Contracts,
  ContractBuyOrder,
  ContractSellOrder,
  User,
} from '@/lib/types';

export async function fetchNFLContracts(): Promise<NFLWinContract[]> {
  const contracts = await getNFLWinContracts();
  return contracts.sort((a, b) => a.contract_id - b.contract_id);
}

export async function fetchLastTradePrices(): Promise<LastTradePrice[]> {
  return await getLastTradePrices();
}

export async function fetchLastTradePricesX100(contractId: number): Promise<LastTradePrice100[]> {
  return await getLastTradePricesX100(contractId);
}

export async function fetchLastTradePricesWith7DaysChange(): Promise<
  LastTradePriceWith7DaysChange[]
> {
  return await getLastTradePricesWith7DaysChange();
}

export async function fetchContracts(): Promise<Contracts[]> {
  return await getContracts();
}

export async function fetchContractBuyOrders(contractId: number): Promise<ContractBuyOrder[]> {
  return await getContractBuyOrders(contractId);
}

export async function fetchContractSellOrders(contractId: number): Promise<ContractSellOrder[]> {
  return await getContractSellOrders(contractId);
}

export async function fetchAllUsers(): Promise<User[]> {
  return await getAllUsers();
}
