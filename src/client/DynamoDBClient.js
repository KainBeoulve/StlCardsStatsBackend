const AWS = require("aws-sdk");
const HelperFunctions = require("../utils/HelperFunctions");

class DynamoDBClient {
    constructor() {
        HelperFunctions.setAWSConfig(AWS);
        this.DynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    };

    /**
     * @param items: Formatted as {key1: value1, key2: value2...}
     * @param tableName: name of table to put data into
     * @returns {Promise<PromiseResult<DynamoDB.PutItemOutput, AWSError>>}
     */
    putItemInTable(items, tableName) {
        const mappedItems = {};
        Object.keys(items).forEach(key => {
            const typeString = DynamoDBClient.getValueType(items[key]);
            mappedItems[key] = {[typeString]: items[key].toString()};
        });
        return this.DynamoDB.putItem({Item: mappedItems, TableName: tableName}).promise();
    };

    static getValueType(value) {
        if (typeof value === "string") {
            return "S";
        } else if (typeof value === "number") {
            return "N";
        } else if (typeof value === "boolean") {
            return "BOOL";
        } else {
            throw new Error(`Unsupported Item Type for Item ${value}`);
        }
    };
}
module.exports = DynamoDBClient;