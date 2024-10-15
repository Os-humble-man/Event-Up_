const env = require('dotenv');
const express = require('express');
const http = require('http');
const DatabaseManager = require('./_core/DatabaseManager');
const { makeApiRouter } = require('./routes');
const { config } = require('./_core/config');
const cors = require('cors')
// const { errorConverters } = require('./utils/ErrorConverters');
const { logger } = require('./_core/Logger');

(async () => {
    try {
        env.config();
        const app = express();
        // app.use(httpLogger());
        app.use(cors())
        app.use(express.json());
        makeApiRouter(app);
        // app.use(errorHandler(errorConverters));
        const server = http.createServer(app);

        // await FirebaseAdmin.init();
        await DatabaseManager.init();
        // await RedisManager.init();

        server.listen(config.server.port, config.server.host, () => {
            logger.info(`Server Started At: ${new Date()}`);
            logger.info(`Server listening at: http://${config.server.host}:${config.server.port}`);
        });
    } catch (error) {
        logger.error(`Error during server initialization: ${error}`);
        process.exit(1);
    }
})();
