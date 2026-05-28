import argon2 from 'argon2';
import pool from '../../db/pool.js';
import { ConflictError, NotFoundError } from '../../common/errors.js';

export var TLService = (function() {
  function TLService() {}

  TLService.prototype.create = async function(input, createdBy) {
    var c = await pool.connect();
    try {
      var exists = await c.query('SELECT id FROM users WHERE email = $1', [input.email]);
      if (exists.rows.length > 0) throw new ConflictError('Email exists');
      var hash = await argon2.hash(input.password);
      var result = await c.query("INSERT INTO users (email, password_hash, name, department, role) VALUES ($1,$2,$3,$4,'TL') RETURNING id, email, name, department, role", [input.email, hash, input.name, input.department]);
      return result.rows[0];
    } catch (e) {
      if (e instanceof ConflictError) throw e;
      throw new Error('Database error: ' + (e.message || 'Unknown'));
    } finally { c.release(); }
  };

  TLService.prototype.getAll = async function(page, limit) {
    page = page || 1; limit = limit || 20;
    var offset = (page - 1) * limit;
    var c = await pool.connect();
    try {
      var result = await c.query("SELECT id, name, email, department, is_active, created_at FROM users WHERE role = 'TL' ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit, offset]);
      var count = await c.query("SELECT COUNT(*) FROM users WHERE role = 'TL'");
      return { data: result.rows, total: parseInt(count.rows[0].count), page: page };
    } finally { c.release(); }
  };

  TLService.prototype.getById = async function(id) {
    var c = await pool.connect();
    try {
      var result = await c.query("SELECT id, name, email, department, is_active FROM users WHERE id = $1 AND role = 'TL'", [id]);
      if (result.rows.length === 0) throw new NotFoundError('TL not found');
      return result.rows[0];
    } finally { c.release(); }
  };

  TLService.prototype.update = async function(id, input, updatedBy) {
    var c = await pool.connect();
    try {
      var sets = []; var vals = []; var i = 1;
      if (input.name) { sets.push('name = $' + i++); vals.push(input.name); }
      if (input.department) { sets.push('department = $' + i++); vals.push(input.department); }
      if (input.isActive !== undefined) { sets.push('is_active = $' + i++); vals.push(input.isActive); }
      if (sets.length === 0) return { id: id };
      sets.push('updated_at = NOW()');
      vals.push(id);
      var result = await c.query('UPDATE users SET ' + sets.join(', ') + ' WHERE id = $' + i + ' RETURNING id, name, email, department, is_active', vals);
      return result.rows[0];
    } finally { c.release(); }
  };

  TLService.prototype.delete = async function(id, deletedBy) {
    var c = await pool.connect();
    try {
      await c.query("UPDATE users SET is_active = false WHERE id = $1 AND role = 'TL'", [id]);
    } finally { c.release(); }
  };

  return TLService;
})();

export var tlService = new TLService();
