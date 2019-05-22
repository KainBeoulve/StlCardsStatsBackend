const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const awsServerlessExpress = require("aws-serverless-express");
const Router = require("./routers/Router");

exports.handler = (event, context) => {
    const app = express();

    app.options("/*", (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.send(200);
    });

    app.use(bodyParser.json());

    app.use(cors());

    app.use('/', Router);

    const server = awsServerlessExpress.createServer(app);

    return awsServerlessExpress.proxy(server, event, context);
};