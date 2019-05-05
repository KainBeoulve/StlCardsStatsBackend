import express from 'express';
import SystemsManagerClient from "client/SystemsManagerClient";
import DynamoDBClient from "client/DynamoDBClient";
import MySportsFeedsClient from "client/MySportsFeedsClient";
import Constants from "utils/Constants";
import HelperFunctions from "utils/HelperFunctions";

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

        // Add all game log data to the data table
        const dynamoDBClient = new DynamoDBClient();
        const addedPlayers = [];
        await Promise.all(data.playergamelogs.gamelogs.map(log => {
            const playerName = `${log.player.LastName.replace(/[^a-zA-Z]/g, "")}-${log.player.FirstName.replace(/[^a-zA-Z]/g, "")}`;
            const items = {
                PlayerName: playerName,
                Date: parseInt(log.game.date.replace(/-/g, ""), 10)
            };

            if (!addedPlayers.includes(playerName)) {
                addedPlayers.push(playerName);
            }

            Object.keys(log.stats).forEach(key => {
                items[key] = log.stats[key]["#text"];
            });
            return dynamoDBClient.putItemInTable(items, Constants.DATA_TABLE_NAME);
        }));

        // Add all player biographical data to the player table
        await Promise.all(addedPlayers.map(player => {
            return syncPlayerInfo(msfClient, dynamoDBClient, player);
        }));

        // Return success message assuming all data writes were successful
        res.status(200).set('Content-Type', 'application/json').send({success:true});
    } catch (err) {
        console.error(`${new Date()}: Error syncing player logs: ${err.message}`);
        res.status(400).set('Content-Type', 'text/plain').send(err.message);
    }
});

const syncPlayerInfo = async (msfClient, dynamoDBClient, playerName) => {
    const playerData = await msfClient.getPlayerData(HelperFunctions.swapPlayerNames(playerName));

    const mappedPlayerItems = {
        PlayerName: playerName
    };

    Constants.PLAYER_FIELDS.forEach(field => {
        const fieldData = playerData.activeplayers.playerentry[0].player[field];
        if (fieldData) {
            mappedPlayerItems[field] = fieldData;
        }
    });

    await dynamoDBClient.putItemInTable(mappedPlayerItems, Constants.PLAYER_TABLE_NAME);
};

export default SyncAllPlayerLogs;