import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';
import { get_routes } from 'get_routes'

exports.handler = (event, context) => {
    const app = express();

    app.use('/get', get_routes);

    const server = awsServerlessExpress.createServer(app);

    awsServerlessExpress.proxy(server, event, context);
};