import * as AWS from 'aws-sdk';
import HelperFunctions from "utils/HelperFunctions";

export default class DynamoDBClient {
    constructor() {
        HelperFunctions.setAWSConfig(AWS);
        this.DynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    };

    /**
     * @param items: Formatted as {key1: value1, key2: value2...}
     * @param tableName: name of table to put data into
     * @returns {Promise<PromiseResult<DynamoDB.PutItemOutput, AWSError>>}
     */
    addPlayerData = (items, tableName) => {
        const mappedItems = {};
        Object.keys(items).forEach(key => {
            const typeString = this.getValueType(items[key]);
            mappedItems[key] = {[typeString]: items[key].toString()};
        });
        return this.DynamoDB.putItem({Item: mappedItems, TableName: tableName}).promise();
    };

    getValueType = (value) => {
        if (typeof value === "string") {
            return "S";
        } else if (typeof value === "number") {
            return "N";
        } else if (typeof value === "boolean") {
            return "BOOL";
        } else {
            throw new Error(`Unsupported Item Type for Item ${value}`);
        }
    }
}