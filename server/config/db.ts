import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Helper function to test DB connection
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL database connected successfully');
    client.release();
  } catch (error) {
    console.error('Database connection error:', error);
  }
};