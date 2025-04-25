// Common types
export type Timestamp = Date;
export type CurrencyCode = string;
export type OrderStatus = string;
export type OrderType = string;

// Contract Buy Orders
export interface ContractBuyOrder {
  buy_order_id: number;
  user_id: number;
  contract_id: number;
  order_type: OrderType;
  status: OrderStatus;
  currency_code: CurrencyCode;
  price_bid: number;
  all_or_none: string;
  contracts_bid: number;
  contracts_available: number;
  expiry_utc: Timestamp;
  created_utc: Timestamp;
  created_session_id: number;
  details: string;
}

// Contract Sell Orders
export interface ContractSellOrder {
  sell_order_id: number;
  user_id: number;
  contract_id: number;
  order_type: OrderType;
  status: OrderStatus;
  currency_code: CurrencyCode;
  price_asked: number;
  all_or_none: string;
  contracts_asked: number;
  contracts_available: number;
  expiry_utc: Timestamp;
  created_utc: Timestamp;
  created_session_id: number;
  details: string;
}

// Contract Transactions
export interface ContractTransaction {
  transaction_id: number;
  buyer_user_id: number;
  seller_user_id: number;
  contract_id: number;
  contracts_transacted: number;
  price: number;
  currency_amount: number;
  currency_code: CurrencyCode;
  via_buy_order_id: number;
  via_sell_order_id: number;
  created_utc: Timestamp;
  details: string;
}

// User
export interface User {
  user_id: number;
  balance: number;
}

// Log Database Errors
export interface LogDatabaseError {
  error_id: number;
  username: string;
  error_number: number;
  error_state: number;
  error_severity: number;
  error_line: number;
  error_procedure: string;
  error_message: string;
  error_utc: Timestamp;
}

// Log System Profit Locks
export interface LogSystemProfitLock {
  lock_id: number;
  created_utc: Timestamp;
  process_name: string;
  profit: number;
  sets_of_matches: number;
  details: string;
}

// Log Tests
export interface LogTest {
  log_id: number;
  calling_procedure: string;
  message: string;
  log_datetime: Timestamp;
}

// Type for NFL win contracts
export type NFLWinContract = {
  contract_id: number;
};

// Type for last trade price data
export type LastTradePrice = {
  contract_id: number;
  last_price: number;
  last_volume: number;
  last_utc: Date;
};

// Type for last 100 trade prices
export type LastTradePrice100 = {
  contract_id: number;
  last_price: number;
  last_volume: number;
  last_utc: Date;
};

export type LastTradePriceWith7DaysChange = {
  contract_id: number;
  last_price: number;
  last_volume: number;
  last_utc: Date;
  price_change_7d: number;
  volume_7d: number;
};

export type Contracts = {
  contract_id: number;
  team_name: string;
  abbreviation: string;
  league: string;
  measurable: string;
};

export interface TradeHistory {
  contract_id: number;
  trade_time_block: string; // Format: "YYYY-MM-DD HH:MM:SS"
  total_trades: number;
  total_volume: number;
  average_price: number;
}
