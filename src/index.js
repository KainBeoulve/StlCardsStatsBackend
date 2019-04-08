import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';
import { routes } from 'routes'

const binaryMimeTypes = [
    'application/javascript',
    'application/json',
    'application/octet-stream',
    'application/xml',
    'font/eot',
    'font/opentype',
    'font/otf',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'text/comma-separated-values',
    'text/css',
    'text/html',
    'text/javascript',
    'text/plain',
    'text/text',
    'text/xml'
];

exports.handler = (event, context) => {
    const app = express();

    app.get('/test', routes);

    const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

    awsServerlessExpress.proxy(server, event, context);
};