class HelperFunctions {

    static setAWSConfig(AWS) {
        AWS.config.update({
            region: "us-east-1",
            accessKeyId: "AKIA2MTN7K4USS6V27ZU",
            secretAccessKey: "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"
        });
    };

    static swapPlayerNames(name) {
        const nameArray = name.split("-");
        return `${nameArray[1]}-${nameArray[0]}`
    };
}
module.exports = HelperFunctions;