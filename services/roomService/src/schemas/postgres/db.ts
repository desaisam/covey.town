import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    password: '123456',
    database: 'user_details',
    host: 'localhost',
    port: 5432
});