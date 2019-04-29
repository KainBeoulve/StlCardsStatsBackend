import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';
import Router from 'routers/Router'

exports.handler = (event, context) => {
    const app = express();

    app.use('/', Router);

    const server = awsServerlessExpress.createServer(app);

    awsServerlessExpress.proxy(server, event, context);
};