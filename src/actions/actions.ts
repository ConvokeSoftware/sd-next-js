/* eslint-disable @typescript-eslint/no-explicit-any */
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
  calculateOpenProfitLossSum,
  getTradeHistoryForContract,
  getBuyOrdersSummary,
  getSellOrdersSummary,
  getUserContractSummary,
  getUserByEmailAndPassword,
  createUser as dbCreateUser,
  setUserInitialSports as dbSetUserInitialSports,
  getUserOpenProfitLossTotal,
  getContractTransactions,
  getUserContractTransactions,
  getBuyOrdersBestAvailPerContract,
  getSellOrdersBestAvailPerContract,
  executeNewBuyOrderWithReport,
  executeNewSellOrderWithReport,
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
  TradeHistory,
  GetSellOrdersSummary,
  GetBuyOrdersSummary,
  UserContractSummary,
  ContractTransaction,
  BestBuyOrder,
  BestSellOrder,
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

export async function fetchOpenProfitLossSum(userId: number): Promise<number> {
  return await calculateOpenProfitLossSum(userId);
}

export async function fetchTradeHistoryForContract(
  contractId: number,
  interval: 'day' | 'week' | 'month' | 'year' = 'day'
): Promise<TradeHistory[]> {
  return await getTradeHistoryForContract(contractId, interval);
}

export async function fetchBuyOrdersSummary(contractId: number): Promise<GetBuyOrdersSummary[]> {
  return await getBuyOrdersSummary(contractId);
}

export async function fetchSellOrdersSummary(contractId: number): Promise<GetSellOrdersSummary[]> {
  return await getSellOrdersSummary(contractId);
}

export async function fetchUserContractSummary(
  userId: number,
  contractId: number
): Promise<UserContractSummary | null> {
  return await getUserContractSummary(userId, contractId);
}

export async function executeBuyOrder(
  userId: number,
  contractId: number,
  price: number,
  contracts: number
): Promise<any> {
  return await executeNewBuyOrderWithReport(userId, contractId, price, contracts);
}

export async function executeSellOrder(
  userId: number,
  contractId: number,
  price: number,
  contracts: number
): Promise<any> {
  return await executeNewSellOrderWithReport(userId, contractId, price, contracts);
}

export async function loginUser(email: string, password: string) {
  return await getUserByEmailAndPassword(email, password);
}

export async function createUser(name: string, email: string, password: string) {
  return await dbCreateUser(name, email, password);
}

export async function setUserInitialSports(userId: number, sports: string[]) {
  return await dbSetUserInitialSports(userId, sports);
}

export async function fetchUserOpenProfitLossTotal(userId: number): Promise<number> {
  return await getUserOpenProfitLossTotal(userId);
}

export async function fetchContractTransactions(
  contractId?: number
): Promise<ContractTransaction[]> {
  return await getContractTransactions(contractId);
}

export async function fetchUserContractTransactions(
  userId: number,
  contractId: number
): Promise<ContractTransaction[]> {
  return await getUserContractTransactions(userId, contractId);
}

export async function fetchBuyOrdersBestAvail(contractId: number): Promise<BestBuyOrder[]> {
  return await getBuyOrdersBestAvailPerContract(contractId);
}

export async function fetchSellOrdersBestAvail(contractId: number): Promise<BestSellOrder[]> {
  return await getSellOrdersBestAvailPerContract(contractId);
}
