export default class HelperFunctions {

    static setAWSConfig = (AWS) => {
        AWS.config.update({
            region: "us-east-1"
        });
    };
}