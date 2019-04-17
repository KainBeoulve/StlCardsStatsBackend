import express from 'express';
import { getActivePlayers } from 'api/getActivePlayers';

export const get_routes = express.Router();

get_routes.use('/activePlayers', getActivePlayers);