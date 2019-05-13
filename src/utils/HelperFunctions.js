class HelperFunctions {

    static setAWSConfig(AWS) {
        AWS.config.update({
            region: "us-east-1"
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