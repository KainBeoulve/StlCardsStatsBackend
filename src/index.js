const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const awsServerlessExpress = require("aws-serverless-express");
const Router = require("./routers/Router");

exports.handler = (event, context) => {
    console.log(event);
    console.log(context);

    const app = express();

    app.use(bodyParser.json());

    app.use(cors());

    app.use('/', Router);

    const server = awsServerlessExpress.createServer(app);

    return awsServerlessExpress.proxy(server, event, context);
};