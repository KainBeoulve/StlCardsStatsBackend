const express = require("express");
const SyncAllPlayerLogs = require("../api/SyncAllPlayerLogs");
const SyncWARConstants = require("../api/SyncWARConstants");

const Router = express.Router();

Router.use('/syncAllPlayerLogs', SyncAllPlayerLogs);
Router.use('/syncWARConstants', SyncWARConstants);

module.exports = Router;