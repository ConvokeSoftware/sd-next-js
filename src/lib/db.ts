import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const sql = neon(process.env.DATABASE_URL);

// Helper function to handle database errors
export function handleDatabaseError(error: unknown): never {
  console.error('Database error:', error);
  throw new Error('An error occurred while accessing the database');
}

// Type for NFL win contracts
export type NFLWinContract = {
  contract_id: number;
};

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
