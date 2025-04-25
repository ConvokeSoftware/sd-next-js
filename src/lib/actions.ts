'use server';

import { sql } from './db';
import { buildInsertQuery, buildUpdateQuery, executeQuery } from './db-helpers';
import type {
  ContractBuyOrder,
  ContractSellOrder,
  ContractTransaction,
  User,
  LogDatabaseError,
  LogSystemProfitLock,
  LogTest,
} from './types';

// Contract Buy Orders CRUD
export async function createBuyOrder(order: Omit<ContractBuyOrder, 'buy_order_id'>) {
  const query = buildInsertQuery('contract_buy_orders', order);
  return executeQuery<ContractBuyOrder>(query);
}

export async function getBuyOrder(id: number) {
  const result = await sql`SELECT * FROM contract_buy_orders WHERE buy_order_id = ${id}`;
  return result[0] as ContractBuyOrder | undefined;
}

export async function updateBuyOrder(id: number, order: Partial<ContractBuyOrder>) {
  const query = buildUpdateQuery('contract_buy_orders', id, order, 'buy_order_id');
  return executeQuery<ContractBuyOrder>(query);
}

export async function deleteBuyOrder(id: number) {
  await sql`DELETE FROM contract_buy_orders WHERE buy_order_id = ${id}`;
  return true;
}

// Contract Sell Orders CRUD
export async function createSellOrder(order: Omit<ContractSellOrder, 'sell_order_id'>) {
  const query = buildInsertQuery('contract_sell_orders', order);
  return executeQuery<ContractSellOrder>(query);
}

export async function getSellOrder(id: number) {
  const result = await sql`SELECT * FROM contract_sell_orders WHERE sell_order_id = ${id}`;
  return result[0] as ContractSellOrder | undefined;
}

export async function updateSellOrder(id: number, order: Partial<ContractSellOrder>) {
  const query = buildUpdateQuery('contract_sell_orders', id, order, 'sell_order_id');
  return executeQuery<ContractSellOrder>(query);
}

export async function deleteSellOrder(id: number) {
  await sql`DELETE FROM contract_sell_orders WHERE sell_order_id = ${id}`;
  return true;
}

// Contract Transactions CRUD
export async function createTransaction(transaction: Omit<ContractTransaction, 'transaction_id'>) {
  const query = buildInsertQuery('contract_transactions', transaction);
  return executeQuery<ContractTransaction>(query);
}

export async function getTransaction(id: number) {
  const result = await sql`SELECT * FROM contract_transactions WHERE transaction_id = ${id}`;
  return result[0] as ContractTransaction | undefined;
}

// Users CRUD
export async function createUser(user: Omit<User, 'user_id'>) {
  const query = buildInsertQuery('users', user);
  return executeQuery<User>(query);
}

export async function getUser(id: number) {
  const result = await sql`SELECT * FROM users WHERE user_id = ${id}`;
  return result[0] as User | undefined;
}

export async function updateUser(id: number, user: Partial<User>) {
  const query = buildUpdateQuery('users', id, user, 'user_id');
  return executeQuery<User>(query);
}

// Logging functions
export async function logDatabaseError(error: Omit<LogDatabaseError, 'error_id' | 'error_utc'>) {
  const query = buildInsertQuery('log_database_errors', {
    ...error,
    error_utc: new Date(),
  });
  return executeQuery<LogDatabaseError>(query);
}

export async function logSystemProfitLock(
  lock: Omit<LogSystemProfitLock, 'lock_id' | 'created_utc'>
) {
  const query = buildInsertQuery('log_system_profit_locks', {
    ...lock,
    created_utc: new Date(),
  });
  return executeQuery<LogSystemProfitLock>(query);
}

export async function logTest(log: Omit<LogTest, 'log_id' | 'log_datetime'>) {
  const query = buildInsertQuery('log_tests', {
    ...log,
    log_datetime: new Date(),
  });
  return executeQuery<LogTest>(query);
}
