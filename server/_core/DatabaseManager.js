const mysql = require('mysql2/promise');
const { config } = require('./config');
const { logger } = require('./Logger');

class DatabaseManager {
    constructor() {
        const poolOptions = {
            host: config.mysql.host,
            port: config.mysql.port,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.database,
            waitForConnections: false,
            connectionLimit: 80,
            maxIdle: 10,
            idleTimeout: 10000,
            dateStrings: true,
            // timezone: 'Z'
        };

        this.pool = mysql.createPool(poolOptions);
    }

    static getInstance() {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    async connect() {
        try {
            await this.pool.getConnection();
            logger.info(`MySql Database ${config.mysql.database} Connected & Ready on ${config.mysql.host}...`);
        } catch (err) {
            logger.error(`MySqlError: ${err.sqlMessage}`);
        }
    }

    getPool() {
        return this.pool;
    }

    static async init() {
        const instance = DatabaseManager.getInstance();
        await instance.connect();
    }
}

module.exports = DatabaseManager;
