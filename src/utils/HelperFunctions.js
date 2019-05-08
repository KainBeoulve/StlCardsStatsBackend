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
}
module.exports = HelperFunctions;