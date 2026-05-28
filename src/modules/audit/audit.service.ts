import pool from '../../db/pool.js';

export var AuditService = (function() {
  function AuditService() {}

  AuditService.prototype.getLogs = async function(filters) {
    var c = await pool.connect();
    try {
      var q = "SELECT a.*, u.name, u.email FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id WHERE 1=1";
      var params = [];
      if (filters.userId) { q += ' AND a.user_id = $' + (params.length+1); params.push(filters.userId); }
      if (filters.action) { q += ' AND a.action = $' + (params.length+1); params.push(filters.action); }
      q += ' ORDER BY a.created_at DESC LIMIT 100';
      var result = await c.query(q, params);
      return { data: result.rows, total: result.rows.length };
    } finally { c.release(); }
  };

  return AuditService;
})();

export var auditService = new AuditService();
