import express from 'express';
import SystemsManagerClient from "client/SystemsManagerClient";
import DynamoDBClient from "client/DynamoDBClient";
import MySportsFeedsClient from "client/MySportsFeedsClient";
import Constants from "utils/Constants";

const SyncAllPlayerLogs = express.Router();

SyncAllPlayerLogs.all('/', async (req, res) => {
    try {
        // Obtain API keys from Systems Manager
        const ssmClient = new SystemsManagerClient();
        const key = await ssmClient.getParameter("SportsFeedsAPIKey", true);
        const password = await ssmClient.getParameter("SportsFeedsAPIPassword", true);

        // Authenticate with MySportsFeeds then acquire data
        const msfClient = new MySportsFeedsClient(key, password);
        const data = await msfClient.getAllGameLogs();

        // Push relevant data to DB, wait for all promises returned from Dynamo to be resolved before continuing
        const dynamoDBClient = new DynamoDBClient();
        await Promise.all(data.playergamelogs.gamelogs.map(log => {
            const items = {
                PlayerName: `${log.player.LastName}-${log.player.FirstName}`,
                Date: parseInt(log.game.date.replace(/-/g, ""), 10)
            };
            Object.keys(log.stats).forEach(key => {
                items[key] = log.stats[key]["#text"];
            });
            //items.AtBats = log.stats.AtBats["#text"];
            return dynamoDBClient.addPlayerData(items, Constants.DATA_TABLE_NAME);
        }));
        res.status(200).set('Content-Type', 'application/json').send({success:true});
    } catch (err) {
        console.error(`${new Date()}: Error syncing player logs: ${err.message}`);
        res.status(400).set('Content-Type', 'text/plain').send(err.message);
    }
});

export default SyncAllPlayerLogs;