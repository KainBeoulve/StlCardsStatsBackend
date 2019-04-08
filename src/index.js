import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';
import { routes } from 'routes'

exports.handler = (event, context) => {
    const app = express();

    app.get('/test', routes);

    const server = awsServerlessExpress.createServer(app);

    awsServerlessExpress.proxy(server, event, context);
};