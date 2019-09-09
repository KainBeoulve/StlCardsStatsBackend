const express = require("express");
const SystemsManagerClient = require("../client/SystemsManagerClient");
const DynamoDBClient = require("../client/DynamoDBClient");
const MySportsFeedsClient = require("../client/MySportsFeedsClient");
const StatisticsHandler = require("../handler/StatisticsHandler");
const Constants = require("../utils/Constants");
const HelperFunctions = require("../utils/HelperFunctions");

const SyncAllPlayerLogs = express.Router();

SyncAllPlayerLogs.all('/', async (req, res) => {
    try {
        // Obtain API keys from Systems Manager
        const ssmClient = new SystemsManagerClient();
        const key = await ssmClient.getParameter("SportsFeedsAPIKey", true);
        const password = await ssmClient.getParameter("SportsFeedsAPIPassword", true);

        // Authenticate with MySportsFeeds then acquire data
        const msfClient = new MySportsFeedsClient(key, password);
        const dynamoDBClient = new DynamoDBClient();
        const lastSyncedDate = await dynamoDBClient.getLastSyncedDate();
        const data = await msfClient.getAllGameLogs(lastSyncedDate);

        // Add all game log data to the data table
        const addedPlayers = [];
        let mostRecentDate = lastSyncedDate || 0;
        await Promise.all(data.playergamelogs.gamelogs.map(log => {
            const playerName = `${log.player.LastName.replace(/[^a-zA-Z]/g, "")}-${log.player.FirstName.replace(/[^a-zA-Z]/g, "")}`;
            const gameId = log.game.id;
            const date = parseInt(log.game.date.replace(/-/g, ""), 10);
            mostRecentDate = date > mostRecentDate ? date : mostRecentDate;

            const items = {
                PlayerName: playerName,
                GameId: gameId,
                Date: date
            };

            if (!addedPlayers.includes(playerName)) {
                addedPlayers.push(playerName);
            }

            Object.keys(log.stats).forEach(key => {
                items[key] = parseFloat(log.stats[key]["#text"]);
            });
            return dynamoDBClient.putItemInTable(items, Constants.GAME_LOG_TABLE_NAME);
        }));

        // Add the special item for lastSyncedDate to the players table
        await dynamoDBClient.putItemInTable(
            {
                PlayerName: Constants.LAST_SYNCED_DATE,
                Date: mostRecentDate
            }, Constants.PLAYER_TABLE_NAME);

        // TODO: Known errors in data need to be updated here before calculating statistics

        // Add all player biographical data to the player table
        await Promise.all(addedPlayers.map(player => {
            return syncPlayerInfo(msfClient, dynamoDBClient, player);
        }));

        // Return success message assuming all data writes were successful
        res.status(200).set('Content-Type', 'application/json').send({success:true, oldSyncDate: lastSyncedDate, newSyncDate: mostRecentDate});
    } catch (err) {
        console.error(`${new Date()}: Error syncing player logs: ${err.message}`);
        res.status(400).set('Content-Type', 'text/plain').send(err.message);
    }
});

syncPlayerInfo = async (msfClient, dynamoDBClient, playerName) => {
    const playerData = await msfClient.getPlayerData(HelperFunctions.swapPlayerNames(playerName));

    // Return if player data does not exist, this is apparently a change they made recently where in-season traded or
    // released players biographical data gets removed.
    if (!playerData.activeplayers.playerentry) {
        return;
    }

    let mappedPlayerItems = {
        PlayerName: playerName
    };

    Constants.PLAYER_FIELDS.forEach(field => {
        const fieldData = playerData.activeplayers.playerentry[0].player[field];
        if (fieldData) {
            mappedPlayerItems[field] = fieldData;
        }
    });

    // If player is not a pitcher append their cached stats
    if(mappedPlayerItems.Position !== "P") {
        const playerStats = await StatisticsHandler.calculatePlayerBattingStatistics(playerName);
        mappedPlayerItems = Object.assign(mappedPlayerItems, playerStats);
    }

    await dynamoDBClient.putItemInTable(mappedPlayerItems, Constants.PLAYER_TABLE_NAME);
};
module.exports = SyncAllPlayerLogs;