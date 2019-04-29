import express from 'express';
import Router from 'routers/Router'

const app = express();

app.use('/', Router);

app.listen(9000, () => {
    console.log("App Listening on port 9000");
});