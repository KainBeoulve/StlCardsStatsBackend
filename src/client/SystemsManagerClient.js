const AWS = require("aws-sdk");
const HelperFunctions = require("../utils/HelperFunctions");

class SystemsManagerClient {
    constructor() {
        HelperFunctions.setAWSConfig(AWS);
        this.SSM = new AWS.SSM({apiVersion: '2014-11-06'});
    };

    async getParameter(parameterName, withDecryption) {
        try {
            const data = await this.SSM.getParameter(
                {Name: parameterName, WithDecryption: withDecryption}).promise();
            return data.Parameter.Value;
        } catch (err) {
            console.error(`${new Date()}: ${err.message}`);
            throw new Error("Something went wrong with obtaining credentials, please contact administrator.");
        }
    };
}
module.exports = SystemsManagerClient;