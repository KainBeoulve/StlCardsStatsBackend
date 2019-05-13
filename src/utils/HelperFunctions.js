class HelperFunctions {

    static setAWSConfig(AWS) {
        AWS.config.update({
            region: "us-east-1",
            accessKeyId: "AKIA2MTN7K4U4E44UVQP",
            secretAccessKey: "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"
        });
    };

    static swapPlayerNames(name) {
        const nameArray = name.split("-");
        return `${nameArray[1]}-${nameArray[0]}`
    };
}
module.exports = HelperFunctions;