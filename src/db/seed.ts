import pool from './pool.js';
import argon2 from 'argon2';
export async function seed() {
  const c = await pool.connect();
  try {
    const ap = await argon2.hash('Admin@123!');
    const tp = await argon2.hash('TL@123!');
    const ep = await argon2.hash('Employee@123!');
    await c.query('INSERT INTO users (email, password_hash, name, role, department) VALUES (,,,,) ON CONFLICT (email) DO NOTHING', ['admin@company.com', ap, 'Admin', 'ADMIN', 'Engineering']);
    await c.query('INSERT INTO users (email, password_hash, name, role, department) VALUES (,,,,) ON CONFLICT (email) DO NOTHING', ['tl@company.com', tp, 'TL', 'TL', 'Product']);
    await c.query('INSERT INTO users (email, password_hash, name, role, department) VALUES (,,,,) ON CONFLICT (email) DO NOTHING', ['employee@company.com', ep, 'Employee', 'EMPLOYEE', 'Product']);
    console.log('Seeded');
  } finally { c.release(); }
}
