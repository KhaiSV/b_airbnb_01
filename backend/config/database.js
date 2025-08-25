// backend/config/database.js
const sql = require('mssql');
const path = require('path');
// nạp .env từ backend/database/.env
require('dotenv').config({
  path: path.join(__dirname, '../database/.env'),
});
function buildConfig() {
  const {
    DB_SERVER,         // ví dụ: "localhost\\SQLEXPRESS"
    DB_INSTANCE,         // tùy chọn: nếu muốn đặt instance riêng
    DB_PORT,             // tùy chọn: nếu dùng cổng cố định
    DB_DATABASE,         // tên DB (bạn đang dùng biến này)
    DB_NAME,             // fallback
    DB_USER,
    DB_PASSWORD,         // bạn đang dùng biến này
    DB_PASS,             // fallback
  } = process.env;

  // Mặc định
  let server = DB_SERVER || 'localhost';
  let instanceName = DB_INSTANCE || null;

  // Nếu có DB_SERVER (ví dụ "localhost\SQLEXPRESS"), tách ra
  if (DB_SERVER) {
    const normalized = DB_SERVER.replace('\\\\', '\\'); // "localhost\\SQLEXPRESS" -> "localhost\SQLEXPRESS"
    const parts = normalized.split('\\');
    server = parts[0] || server;
    if (parts[1]) instanceName = parts[1];
  }

  const config = {
    server,
    database: DB_DATABASE || DB_NAME || 'DB_Airbnb',
    user: DB_USER || 'sa',
    password: DB_PASSWORD || DB_PASS || '',
    options: {
      trustServerCertificate: true,
      encrypt: false,
      enableArithAbort: true,
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  };

  if (DB_PORT) {
    config.server = server || '127.0.0.1';
    config.port = parseInt(DB_PORT, 10);
  } else if (instanceName) {
    config.options.instanceName = instanceName;
  }

  return config;
}

const config = buildConfig();

let pool = null;

const database = {
  async connect() {
    try {
      if (!pool) {
        pool = await sql.connect(config);
        console.log('✅ Connected to SQL Server successfully');
      }
      return pool;
    } catch (err) {
      console.error('❌ Database connection failed:', err.message);
      throw err;
    }
  },

  async query(queryString, params = []) {
    try {
      if (!pool) await this.connect();
      const request = pool.request();
      params.forEach((param, idx) => request.input(`param${idx}`, param));
      return await request.query(queryString);
    } catch (err) {
      console.error('❌ Query error:', err.message);
      throw err;
    }
  },

  async close() {
    if (pool) {
      await pool.close();
      pool = null;
    }
  },
};

module.exports = database;
