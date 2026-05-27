import argon2 from 'argon2';
import pool from '../../db/pool.js';
import { ConflictError, NotFoundError } from '../../common/errors.js';

export var TLService = (function() {
  function TLService() {}

  TLService.prototype.create = async function(input, createdBy) {
    var c = await pool.connect();
    try {
      var exists = await c.query("SELECT id FROM users WHERE email = $1", [input.email]);
      if (exists.rows.length > 0) throw new ConflictError('Email exists');
      var hash = await argon2.hash(input.password);
      var result = await c.query("INSERT INTO users (email, password_hash, name, department, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, email, name, department, role", [input.email, hash, input.name, input.department, 'TL']);
      return result.rows[0];
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

  return TLService;
})();

export var tlService = new TLService();
