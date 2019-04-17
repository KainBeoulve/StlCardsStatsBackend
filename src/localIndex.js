import express from 'express';
import { get_routes } from 'get_routes'

const app = express();

app.use('/get', get_routes);

app.listen(9000, () => {
    console.log("App Listening on port 9000");
});