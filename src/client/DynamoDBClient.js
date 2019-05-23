const AWS = require("aws-sdk");
const Constants = require("../utils/Constants");
const HelperFunctions = require("../utils/HelperFunctions");

class DynamoDBClient {
    constructor() {
        HelperFunctions.setAWSConfig(AWS);
        this.DynamoDBDocumentClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
    };

    /**
     * Puts an item into the specified Dynamo Table
     * @param item: Formatted as {key1: value1, key2: value2...}
     * @param tableName: name of table to put data into
     */
    putItemInTable(item, tableName) {
        return this.DynamoDBDocumentClient.put({Item: item, TableName: tableName}).promise();
    };

    //TODO: Probably can only use one get method and pass in table as a param, or have multiple clients (one for each table)

    /**
     * Function to return the special item that corresponds to the last gameDates the data was synced
     */
    async getLastSyncedDate() {
        const data = await this.DynamoDBDocumentClient.get(
            {
                Key: {
                    PlayerName: Constants.LAST_SYNCED_DATE
                },
                TableName: Constants.PLAYER_TABLE_NAME
            }).promise();
        return data.Item && data.Item.Date ? data.Item.Date : "";
    };

    /**
     * Function to retrieve player data from the player table
     * @param playerName: Name of player to retrieve data for
     */
    async getPlayerData(playerName) {
        return this.DynamoDBDocumentClient.get(
            {
                Key: {
                    PlayerName: playerName
                },
                TableName: Constants.PLAYER_TABLE_NAME
            }).promise();
    };

    /**
     * Function to return stats for a given player
     * @param playerName: Name of player to retrieve stats for
     */
    queryStatsForPlayer(playerName) {
        const params = {
            ExpressionAttributeValues: {
                ":hkey": playerName
            },
            KeyConditionExpression: "PlayerName = :hkey",
            TableName: Constants.GAME_LOG_TABLE_NAME
        };
        return this.DynamoDBDocumentClient.query(params).promise();
    };
}
module.exports = DynamoDBClient;