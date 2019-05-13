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

    /**
     * Function obtains NL specific data required for calculations from FanGraphs
     */
    async getNLSpecificData() {
        const formData = new FormData({});
        formData.append(this.constants.eventTarget.name, this.constants.eventTarget.valueNL);
        formData.append(this.constants.viewState.name, this.constants.viewState.valueNL);
        formData.append(this.constants.eventValidation.name, this.constants.eventValidation.valueNL);

        let response = await fetch("https://www.fangraphs.com/leaders.aspx?pos=np&stats=bat&lg=nl&qual=0&type=c,6,52&season=2019&month=0&season1=1871&ind=0&team=0,ss&rost=0&age=0&filter=&players=0", {
            method: "POST",
            body: formData
        });
        const textResponse = await response.text();
        return textResponse.replace("\ufeff","");
    };
}
module.exports = FanGraphsClient;