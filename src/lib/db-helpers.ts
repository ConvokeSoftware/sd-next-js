import { sql, handleDatabaseError } from './db';
import {
  NFLWinContract,
  LastTradePrice,
  LastTradePrice100,
  LastTradePriceWith7DaysChange,
  Contracts,
  ContractBuyOrder,
  ContractSellOrder,
} from './types';

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
    `;
    return result as ContractSellOrder[];
  } catch (error) {
    handleDatabaseError(error);
  }
}
