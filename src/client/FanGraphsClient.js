const fetch = require("node-fetch");
const FormData = require("form-data");
const Constants = require("../utils/Constants");

class FanGraphsClient {
    constructor() {
        this.constants = Constants.FANGRAPHS_CONSTANTS;
    };

    /**
     * Function obtains MLB average data required for calculations from FanGraphs
     */
    async getMLBAverageData() {
        const formData = new FormData({});
        formData.append(this.constants.eventTarget.name, this.constants.eventTarget.valueMLB);
        formData.append(this.constants.viewState.name, this.constants.viewState.valueMLB);
        formData.append(this.constants.eventValidation.name, this.constants.eventValidation.valueMLB);

        const response = await fetch("https://www.fangraphs.com/guts.aspx?type=cn", {
           method: "POST",
           body: formData
        });
        const textResponse = await response.text();
        return textResponse.replace("\ufeff","");
    };
}
module.exports = FanGraphsClient;