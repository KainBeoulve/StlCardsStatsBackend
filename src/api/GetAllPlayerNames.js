const express = require("express");
const Constants = require("../utils/Constants");
const DynamoDBClient = require("../client/DynamoDBClient");

const GetAllPlayerNames = express.Router();

GetAllPlayerNames.get('/', async (req, res) => {
    try {
        const dynamoDBClient = new DynamoDBClient();
        const playerData = await dynamoDBClient.scanPlayerTable();
        let filteredPlayerArray;

        if (playerData.Items) {
            filteredPlayerArray = playerData.Items.filter(
                item => req.query.getPitchers && JSON.parse(req.query.getPitchers)
                    ? item.Position === Constants.PITCHER_STRING
                    : item.Position !== Constants.PITCHER_STRING
            ).map(item => item.PlayerName);
            res.status(200).set("Content-Type", "application/json").send(filteredPlayerArray);
        } else {
            console.error(`Dynamo scan call returned empty.`);
            res.status(400).set("Content-Type", "text/plain").send(Constants.ERRORS.statisticError);
        }
    } catch (error) {
        console.error(`Something went wrong with the dynamo scan call.`);
        res.status(400).set("Content-Type", "text/plain").send(Constants.ERRORS.statisticError);
    }
});
module.exports = GetAllPlayerNames;