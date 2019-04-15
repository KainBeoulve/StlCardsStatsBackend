import express from 'express';

export const routes = express.Router();

routes.get('/', (req, res) => {
    res.status(200).set('Content-Type', 'text/html').send('<h1>WE DID IT!!</h1>');
});