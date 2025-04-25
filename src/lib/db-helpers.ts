import { sql } from './db';

type QueryResult = {
  rows: Record<string, unknown>[];
};

export function buildInsertQuery(tableName: string, data: Record<string, unknown>) {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

  return {
    text: `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
    values,
  };
}

export function buildUpdateQuery(
  tableName: string,
  id: number,
  data: Record<string, unknown>,
  idColumn: string = 'id'
) {
  const entries = Object.entries(data);
  const setClause = entries.map(([key], i) => `${key} = $${i + 1}`).join(', ');
  const values = [...Object.values(data), id];

  return {
    text: `UPDATE ${tableName} SET ${setClause} WHERE ${idColumn} = $${values.length} RETURNING *`,
    values,
  };
}

export async function executeQuery<T>(query: { text: string; values: unknown[] }): Promise<T> {
  try {
    const result = (await sql.query(query.text, query.values)) as unknown as QueryResult;
    return result.rows[0] as unknown as T;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('An error occurred while accessing the database');
  }
}
