import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();

export const DB_NAME = process.env.DB_NAME || 'combinations_task';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
