const express = require("express");
const Papa = require("papaparse");
const Constants = require("../utils/Constants");
const DynamoDBClient = require("../client/DynamoDBClient");
const FanGraphsClient = require("../client/FanGraphsClient");

const SyncWARConstants = express.Router();
SyncWARConstants.all('/', async (req, res) => {
    try {
        const dynamoDBClient = new DynamoDBClient();
        const fanGraphsClient = new FanGraphsClient();

        const leagueAverageData = await fanGraphsClient.getMLBAverageData();

        // Parse MLB CSV data from FanGraphs
        const parsedLeagueData = Papa.parse(leagueAverageData, {
            header: true,
            skipEmptyLines: true
        });

        // Convert strings to numbers then store the data in the WAR Constants Table
        await Promise.all(parsedLeagueData.data.map( seasonData => {
            Object.keys(seasonData).forEach(key => {
                seasonData[key] = parseFloat(seasonData[key]);
            });
            return dynamoDBClient.putItemInTable(seasonData, Constants.WAR_CONSTANTS_TABLE_NAME);
        }));

        res.status(200).set('Content-Type', 'application/json').send({success: true});
    } catch (err) {
        console.error(`${new Date()}: Error syncing WAR constants: ${err.message}`);
        res.status(400).set('Content-Type', 'text/plain').send(err.message);
    }
});
module.exports = SyncWARConstants;