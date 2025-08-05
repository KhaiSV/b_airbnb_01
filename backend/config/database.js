const sql = require('mssql');
require('dotenv').config();

const config = {
    server: 'localhost',
    database: 'DB_Airbnb',
    user: 'sa',
    password: '13012004',
    options: {
        trustServerCertificate: true,
        encrypt: false,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

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
            console.error('❌ Database connection failed:', err);
            throw err;
        }
    },

    async query(queryString, params = []) {
        try {
            if (!pool) {
                await this.connect();
            }
            
            const request = pool.request();
            
            params.forEach((param, index) => {
                request.input(`param${index}`, param);
            });
            
            const result = await request.query(queryString);
            return result;
        } catch (err) {
            console.error('Query error:', err);
            throw err;
        }
    },

    async close() {
        if (pool) {
            await pool.close();
            pool = null;
        }
    }
};

module.exports = database;