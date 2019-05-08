const mySportsFeeds = require("mysportsfeeds-node");
const moment = require("moment");

class MySportsFeedsClient {
    constructor(key, password) {
        this.msf = new mySportsFeeds("1.2", false, null);
        this.msf.authenticate(key, password);
    };

    async getPlayerData(playerName) {
        try {
            return await this.msf.getData("mlb", "2019-regular", "active_players", "json",
                {
                    team: "stl",
                    player: playerName,
                    force: true
                });
        } catch (err) {
            console.error(`${new Date()}: ${err.message}`);
            throw new Error("Something went wrong with obtaining statistics, please contact administrator.");
        }
    };

    /**
     * Syncs data from MySportsFeeds into Dynamo
     * @param lastSyncedDate - earliest date to begin syncing data from
     */
    async getAllGameLogs(lastSyncedDate) {
        try {
            const parsedDate = moment(lastSyncedDate, ["YYYYMMDD", "YYYY-MM-DD"]);
            return await this.msf.getData("mlb", "2019-regular", "player_gamelogs", "json",
                {
                    team: "stl",
                    date: parsedDate.isValid() ? `since-${lastSyncedDate}` : "since-20190101",
                    sort: "player.lastname",
                    force: true
                });
        } catch (err) {
            console.error(`${new Date()}: ${err.message}`);
            throw new Error("Something went wrong with obtaining statistics, please contact administrator.");
        }
    };
}
module.exports = MySportsFeedsClient;