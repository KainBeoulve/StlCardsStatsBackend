const express = require("express");
const SyncAllPlayerLogs = require("../api/SyncAllPlayerLogs");

const Router = express.Router();

Router.use('/syncAllPlayerLogs', SyncAllPlayerLogs);

module.exports = Router;