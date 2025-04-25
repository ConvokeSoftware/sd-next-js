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
