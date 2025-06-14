/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql, handleDatabaseError } from './db';
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
  GetBuyOrdersSummary,
  GetSellOrdersSummary,
  UserContractSummary,
  ContractTransaction,
  BestBuyOrder,
  BestSellOrder,
} from './types';

// Interface for open profit/loss sum calculation result
export interface OpenProfitLossSum {
  total_profit_loss: number;
  // Add more fields as needed once we know the exact return type
}

// Utility function to fetch NFL win contract IDs
export async function getNFLWinContracts(): Promise<NFLWinContract[]> {
  try {
    const result = await sql`
        SELECT * FROM nfl_win_contract_ids_mv
      `;
    return result as NFLWinContract[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Function to fetch last trade prices for contracts
export async function getLastTradePrices(): Promise<LastTradePrice[]> {
  try {
    const result = await sql`
        SELECT * FROM last_trade_price_per_contract_view
      `;
    return result as LastTradePrice[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Function to fetch last 100 trade prices for a specific contract
export async function getLastTradePricesX100(contractId: number): Promise<LastTradePrice100[]> {
  try {
    const result = await sql`
        SELECT * FROM last_trade_prices_per_contract_x100_view
        WHERE contract_id = ${contractId}
        ORDER BY last_utc DESC
      `;
    return result as LastTradePrice100[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getLastTradePricesWith7DaysChange(): Promise<
  LastTradePriceWith7DaysChange[]
> {
  try {
    const result = await sql`
      SELECT * FROM last_trade_prices_plus7d_change_view
    `;
    return result as LastTradePriceWith7DaysChange[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getContracts(): Promise<Contracts[]> {
  try {
    const result = await sql`
      SELECT * FROM contracts
    `;
    return result as Contracts[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getContractBuyOrders(contractId: number): Promise<ContractBuyOrder[]> {
  try {
    const result = await sql`
      SELECT * FROM contract_buy_orders
      WHERE contract_id = ${contractId}
      AND contracts_available > 0
      AND expiry_utc > NOW()
    `;
    return result as ContractBuyOrder[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getContractSellOrders(contractId: number): Promise<ContractSellOrder[]> {
  try {
    const result = await sql`
      SELECT * FROM contract_sell_orders
      WHERE contract_id = ${contractId}
      AND contracts_available > 0
      AND expiry_utc > NOW()
    `;
    return result as ContractSellOrder[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const result = await sql`
      SELECT * FROM users
    `;
    return result as User[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function calculateOpenProfitLossSum(userId: number): Promise<number> {
  try {
    const result = await sql`
      SELECT calculate_open_profit_loss_sum(${userId})
    `;
    return result[0].calculate_open_profit_loss_sum;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getTradeHistoryForContract(
  contractId: number,
  interval: 'day' | 'week' | 'month' | 'year' = 'day'
): Promise<TradeHistory[]> {
  try {
    const result = await sql`
      SELECT * FROM get_trades_history(${contractId}, ${interval})
    `;
    return result as TradeHistory[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getBuyOrdersSummary(contractId: number): Promise<GetBuyOrdersSummary[]> {
  try {
    const result = await sql`
      SELECT * FROM get_buy_orders_summary(${contractId})
    `;
    return result as GetBuyOrdersSummary[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getSellOrdersSummary(contractId: number): Promise<GetSellOrdersSummary[]> {
  try {
    const result = await sql`
      SELECT * FROM get_sell_orders_summary(${contractId})
    `;
    return result as GetSellOrdersSummary[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getUserContractSummary(
  userId: number,
  contractId: number
): Promise<UserContractSummary | null> {
  try {
    const result = await sql`
      SELECT * FROM get_user_contract_summary(${userId}, ${contractId})
    `;
    console.log('result', result);
    return (result[0] as UserContractSummary) || null;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function executeNewBuyOrder(
  userId: number,
  contractId: number,
  price: number,
  contracts: number
): Promise<null> {
  console.log('executeNewBuyOrder', userId, contractId, price, contracts);
  try {
    const result = await sql`
      CALL order_match_new_buy(
        ${userId}::int4,
        ${contractId}::int4,
        ${price}::numeric,
        ${contracts}::int4,
        null
      )
    `;
    console.log('result', result);
    return null;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function executeNewSellOrder(
  userId: number,
  contractId: number,
  price: number,
  contracts: number
): Promise<null> {
  try {
    const result = await sql`
      CALL order_match_new_sell(
        ${userId}::int4,
        ${contractId}::int4,
        ${price}::numeric,
        ${contracts}::int4,
        null
      )
    `;
    console.log('result', result);
    return null;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getUserByEmailAndPassword(email: string, password: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email} AND password = ${password}
    `;
    return result[0] || null;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function createUser(name: string, email: string, password: string) {
  try {
    const result = await sql`
      INSERT INTO users (name, email, password, balance)
      VALUES (${name}, ${email}, ${password}, 100000.00)
      RETURNING *
    `;
    return result[0] || null;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function setUserInitialSports(userId: number, sports: string[]) {
  try {
    const result = await sql`
      UPDATE users SET "initialSports" = ${sports} WHERE user_id = ${userId} RETURNING *
    `;
    return result[0] || null;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getUserOpenProfitLossTotal(userId: number): Promise<number> {
  try {
    const result = await sql`
      SELECT get_user_open_profit_loss_total(${userId})
    `;
    return result[0].get_user_open_profit_loss_total;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getContractTransactions(contractId?: number): Promise<ContractTransaction[]> {
  try {
    const result = await sql`
      SELECT * FROM contract_transactions
      ${contractId ? sql`WHERE contract_id = ${contractId}` : sql``}
      ORDER BY created_utc DESC
      LIMIT 100
    `;
    return result as ContractTransaction[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getUserContractTransactions(
  userId: number,
  contractId: number
): Promise<ContractTransaction[]> {
  try {
    const result = await sql`
      SELECT * FROM get_user_contract_transactions_per_contract(${userId}, ${contractId})
      ORDER BY created_utc DESC
    `;
    return result as ContractTransaction[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getBuyOrdersBestAvailPerContract(
  contractId: number
): Promise<BestBuyOrder[]> {
  try {
    const result = await sql`
      SELECT * FROM get_buy_orders_best_avail_per_contract(${contractId})
    `;
    return result as BestBuyOrder[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getSellOrdersBestAvailPerContract(
  contractId: number
): Promise<BestSellOrder[]> {
  try {
    const result = await sql`
      SELECT * FROM get_sell_orders_best_avail_per_contract(${contractId})
    `;
    return result as BestSellOrder[];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function executeNewBuyOrderWithReport(
  userId: number,
  contractId: number,
  price: number,
  contracts: number
): Promise<any> {
  try {
    const result = await sql`
      SELECT * FROM public.wrapper_order_match_buy(
        ${userId}::int4,
        ${contractId}::int4,
        ${price}::numeric,
        ${contracts}::int4
      )
    `;
    return result;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function executeNewSellOrderWithReport(
  userId: number,
  contractId: number,
  price: number,
  contracts: number
): Promise<any> {
  try {
    const result = await sql`
      SELECT * FROM public.wrapper_order_match_sell(
        ${userId}::int4,
        ${contractId}::int4,
        ${price}::numeric,
        ${contracts}::int4
      )
    `;
    return result;
  } catch (error) {
    handleDatabaseError(error);
  }
}
