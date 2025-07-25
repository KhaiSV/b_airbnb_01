const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.SERVER_NAME || 'localhost\\SQLEXPRESS',
    database: 'DB_Airbnb',
    options: {
        trustServerCertificate: true,
        trustedConnection: true,
        enableArithAbort: true,
        encrypt: false,
        port: 1433
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

class Database {
    constructor() {
        this.pool = null;
    }

    async connect() {
        try {
            this.pool = await sql.connect(config);
            console.log('✅ Connected to SQL Server');
            return this.pool;
        } catch (err) {
            console.error('❌ Database connection failed:', err);
            throw err;
        }
    }

    async query(queryString, params = []) {
        try {
            if (!this.pool) {
                await this.connect();
            }
            
            const request = this.pool.request();
            
            // Add parameters if provided
            params.forEach((param, index) => {
                request.input(`param${index}`, param);
            });
            
            const result = await request.query(queryString);
            return result;
        } catch (err) {
            console.error('Query error:', err);
            throw err;
        }
    }

    async close() {
        if (this.pool) {
            await this.pool.close();
        }
    }
}

module.exports = new Database();
