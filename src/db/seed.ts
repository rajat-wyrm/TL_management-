import pool from './pool.js';
import argon2 from 'argon2';

export async function seed() {
  var c = await pool.connect();
  try {
    var ap = await argon2.hash('Admin@123!');
    var tp = await argon2.hash('TL@123!');
    var ep = await argon2.hash('Employee@123!');
    await c.query("INSERT INTO users (email, password_hash, name, role, department) VALUES ('admin@company.com', '" + ap + "', 'Admin', 'ADMIN', 'Engineering') ON CONFLICT (email) DO NOTHING");
    await c.query("INSERT INTO users (email, password_hash, name, role, department) VALUES ('tl@company.com', '" + tp + "', 'TL', 'TL', 'Product') ON CONFLICT (email) DO NOTHING");
    await c.query("INSERT INTO users (email, password_hash, name, role, department) VALUES ('employee@company.com', '" + ep + "', 'Employee', 'EMPLOYEE', 'Product') ON CONFLICT (email) DO NOTHING");
  } finally { c.release(); }
}
