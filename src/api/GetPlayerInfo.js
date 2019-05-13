const express = require("express");
const Constants = require("../utils/Constants");
const DynamoDBClient = require("../client/DynamoDBClient");

const GetPlayerInfo = express.Router();

GetPlayerInfo.all('/', async (req, res) => {
    if (req.body.playerName) {
        const dynamoDBClient = new DynamoDBClient();
        // TODO: Need error handling here
        const playerData =  await dynamoDBClient.getPlayerData(req.body.playerName);
        res.status(200).set('Content-Type', 'application/json').send(playerData.Item);
    } else {
        console.error("Null or undefined player name.");
        res.status(400).set("Content-Type", "text/plain")
            .send(Constants.ERRORS.statisticError);
    }
});
module.exports = GetPlayerInfo;