import express from 'express';
import { routes } from 'routes'

const app = express();

app.get('/test', routes);

app.listen(9000, () => {
    console.log("App Listening on port 9000");
});