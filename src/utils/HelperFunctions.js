class HelperFunctions {

    static setAWSConfig(AWS) {
        AWS.config.update({
            region: "us-east-1",
            accessKeyId: "AKIA2MTN7K4U7HIF7TGV",
            secretAccessKey: "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"
        });
    };

    static swapPlayerNames(name) {
        const nameArray = name.split("-");
        return `${nameArray[1]}-${nameArray[0]}`
    };

    static getLastEntry(array) {
        return array[array.length - 1];
    };
}
module.exports = HelperFunctions;