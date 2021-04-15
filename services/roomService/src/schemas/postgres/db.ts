import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  password: 'admin',
  database: 'user_details',
  host: 'localhost',
  port: 5432,
});

// import { Pool } from 'pg';

// const pool = new Pool({
//   user: 'ijgxxkigevqpme',
//   password: '8eebce44c97a1204852ebc6e61f79ef83d02cf7d380dc1791315999bcb399272',
//   database: 'dfupuj37diulh',
//   host: 'ec2-34-225-167-77.compute-1.amazonaws.com',
//   port: 5432,
// });

export default pool;
