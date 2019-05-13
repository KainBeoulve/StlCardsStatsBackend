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
        const nlSpecificData = await fanGraphsClient.getNLSpecificData();

        // Parse MLB CSV data from FanGraphs
        const parsedLeagueData = Papa.parse(leagueAverageData, {
            header: true,
            skipEmptyLines: true
        });

        // Reformat parsed data to the form [ Year1: { key1: value1, key2, value2, ...}, ... ]
        const newParsedLeagueData = {};
        parsedLeagueData.data.forEach( dataObject => {
            newParsedLeagueData[dataObject[Constants.SEASON]] = {};
            Object.keys(dataObject).forEach(key => {
                if (key !== Constants.SEASON) {
                    newParsedLeagueData[dataObject[Constants.SEASON]][key] = parseFloat(dataObject[key]);
                }
            });
        });

        // Parse NL CSV data from FanGraphs
        const parsedNLData = Papa.parse(nlSpecificData, {
            header: true,
            skipEmptyLines: true
        });

        // Reformat parsed data to the form { Year1: { key1: value1, key2, value2, ...}, ... }
        const newParsedNLData = {};
        parsedNLData.data.forEach( dataObject => {
            newParsedNLData[dataObject[Constants.SEASON]] = {};
            Object.keys(dataObject).forEach(key => {
                if (key !== Constants.SEASON) {
                    newParsedNLData[dataObject[Constants.SEASON]][key] = parseFloat(dataObject[key]);
                }
            });
        });

        // For each year, if MLB & NL objects both contain the year, combine the data fields in both objects into a new
        // object and send to Dynamo, otherwise skip the year.
        await Promise.all(Object.keys(newParsedLeagueData).map( key => {
            if (newParsedNLData[key]) {
                const items = {};
                items[Constants.SEASON] = parseFloat(key);
                Object.keys(newParsedLeagueData[key]).forEach(innerKey => {
                    items[innerKey] = parseFloat(newParsedLeagueData[key][innerKey]);
                });
                Object.keys(newParsedNLData[key]).forEach(innerKey => {
                    items[innerKey] = parseFloat(newParsedNLData[key][innerKey]);
                });
                return dynamoDBClient.putItemInTable(items, Constants.WAR_CONSTANTS_TABLE_NAME);
            }
            return Promise.resolve();
        }));

        res.status(200).set('Content-Type', 'application/json').send({success: true});
    } catch (err) {
        console.error(`${new Date()}: Error syncing WAR constants: ${err.message}`);
        res.status(400).set('Content-Type', 'text/plain').send(err.message);
    }
});
module.exports = SyncWARConstants;