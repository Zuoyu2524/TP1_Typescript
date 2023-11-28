import * as pg from 'pg';

const { Pool } = require('pg');

// Replace these values with your PostgreSQL credentials
export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '186971ZHzy!',
  port: 5432, 
});
