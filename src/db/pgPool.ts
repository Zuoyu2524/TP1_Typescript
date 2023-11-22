import * as pg from 'pg';

const { Pool } = require('pg');

// Replace these values with your PostgreSQL credentials
export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123456',
  port: 5432, 
});
