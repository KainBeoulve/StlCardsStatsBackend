const express = require("express");
const Constants = require("../utils/Constants");
const DynamoDBClient = require("../client/DynamoDBClient");

const GetPlayerInfo = express.Router();

GetPlayerInfo.get('/', async (req, res) => {
    if (req.query.playerName) {
        const dynamoDBClient = new DynamoDBClient();
        const playerData =  await dynamoDBClient.getPlayerData(req.query.playerName);
        if (playerData.Item) {
            res.status(200).set("Content-Type", "application/json").send(playerData.Item);
        } else {
            console.error(`Player: ${req.query.playerName} not found in the database.`);
            res.status(400).set("Content-Type", "text/plain").send(Constants.ERRORS.noPlayerError);
        }
    } else {
        console.error("Null or undefined player name.");
        res.status(400).set("Content-Type", "text/plain").send(Constants.ERRORS.statisticError);
    }
});
module.exports = GetPlayerInfo;