const express = require("express");
const GetPlayerInfo = require("../api/GetPlayerInfo");
const SyncAllPlayerLogs = require("../api/SyncAllPlayerLogs");
const SyncWARConstants = require("../api/SyncWARConstants");

const Router = express.Router();

Router.use('/syncAllPlayerLogs', SyncAllPlayerLogs);
Router.use('/syncWARConstants', SyncWARConstants);
Router.use('/getPlayerInfo', GetPlayerInfo);
Router.options("/*", (req, res) => {
    res.status(200).set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
    }).send("OK");
});

module.exports = Router;