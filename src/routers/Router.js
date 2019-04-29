import express from 'express';
import SyncAllPlayerLogs from "api/SyncAllPlayerLogs"

const Router = express.Router();

Router.use('/syncAllPlayerLogs', SyncAllPlayerLogs);

export default Router;