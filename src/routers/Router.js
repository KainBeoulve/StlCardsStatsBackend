const express = require("express");
const GetPlayerInfo = require("../api/GetPlayerInfo");
const SyncAllPlayerLogs = require("../api/SyncAllPlayerLogs");
const SyncWARConstants = require("../api/SyncWARConstants");

const Router = express.Router();

Router.use('/syncAllPlayerLogs', SyncAllPlayerLogs);
Router.use('/syncWARConstants', SyncWARConstants);
Router.use('/getPlayerInfo', GetPlayerInfo);

module.exports = Router;