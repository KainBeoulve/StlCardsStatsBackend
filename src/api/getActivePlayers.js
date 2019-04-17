import express from 'express';
import * as AWS from 'aws-sdk';
//import mySportsFeeds from 'mysportsfeeds-node';

export const getActivePlayers = express.Router();

AWS.config.update({
    region: "us-east-1"
});

const ssm = new AWS.SSM({apiVersion: '2014-11-06'});

getActivePlayers.get('/', async (req, res) => {
    let apiKey = "";
    let password = "";
    try {
        await ssm.getParameter({Name: "SportsFeedsAPIKey", WithDecryption: true}, (err, data) => {
            if (err) { console.log(err); throw err; }
            else apiKey = data.Parameter.Value;
        }).promise();
        await ssm.getParameter({Name: "SportsFeedsAPIPassword", WithDecryption: true}, (err, data) => {
            if (err) { console.log(err); throw err; }
            else password = data.Parameter.Value;
        }).promise();
        res.status(200).set('Content-Type', 'application/json').send({thisWorked: "thisWorked"});
    } catch (err) {
        res.status(400).set('Content-Type', 'text/plain').send(
            "Something went wrong with obtaining API Keys, please contact administrator."
        );
    }
});