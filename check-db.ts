import pool from './src/db/pool.js';
var c = await pool.connect();
var r = await c.query('SELECT * FROM users');
console.log('ROW COUNT:', r.rows.length);
if (r.rows.length > 0) console.log('FIRST:', r.rows[0].email, r.rows[0].role);
c.release();
