const express = require("express");
const bodyParser = require("body-parser");
const Router = require("./routers/Router");

const app = express();

app.use(bodyParser.json());

app.use('/', Router);

app.listen(9000, () => {
    console.log("App Listening on port 9000");
});