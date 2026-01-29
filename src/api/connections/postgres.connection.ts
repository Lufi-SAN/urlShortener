import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pg = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pg.on("error", (err) => {
  console.error("[postgres.connection.ts] PostgreSQL Pool Error", err);
});

const pgConnectWithRetry = async (retries: number = 5, delay: number = 2000): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
        console.log('[postgres.connection.ts] Attempting to connect to PostgreSQL database...');
        await pg.query('SELECT 1');//conn
        console.log('[postgres.connection.ts] Connected to PostgreSQL database successfully.');
        return;
    }
    catch (err) {
        console.error(`[postgres.connection.ts] PostgreSQL connection attempt ${i + 1} failed:`, err);
        if (i < retries - 1) {
            console.log(`[postgres.connection.ts] Retrying in ${delay / 1000} seconds...`);
            await new Promise(res => setTimeout(res, delay));
        } else {
            console.error('[postgres.connection.ts] All PostgreSQL connection attempts failed.');
            throw err;
        }
    }
  }
}

export { pg, pgConnectWithRetry }