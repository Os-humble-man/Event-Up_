const express = require('express');
const { Router } = require('express');
const { logger } = require('../_core/Logger');
const { eventRoutes } = require('./EventRoutes');
const { userRoutes } = require('./UserRoutes');

const makeApiRouter = (app) => {
    const rootRouter = Router();
    const apiRouter = Router();

    rootRouter.get('/welcome', () => console.log(('index.js')));
    rootRouter.use('/api', apiRouter);
    app.use('/uploads', express.static('uploads'));
    apiRouter.use(userRoutes)
    apiRouter.use(eventRoutes)    


    app.use(rootRouter);

    logger.info('All Routes have been registered!');
};

module.exports = { makeApiRouter };
