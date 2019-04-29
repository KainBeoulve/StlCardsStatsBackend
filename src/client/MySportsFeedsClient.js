import mySportsFeeds from "mysportsfeeds-node";
import moment from "moment";

export default class MySportsFeedsClient {
    constructor(key, password) {
        this.msf = new mySportsFeeds("1.2", false, null);
        this.msf.authenticate(key, password);
    };

    getActivePlayers = async () => {
        try {
            return await this.msf.getData("mlb", "2019-regular", "active_players", "json",
                {
                    team: "stl",
                    rosterstatus: "assigned-to-roster,assigned-to-injury-list",
                    sort: "player.lastname",
                    force: true
                });
        } catch (err) {
            console.error(`${new Date()}: ${err.message}`);
            throw new Error("Something went wrong with obtaining statistics, please contact administrator.");
        }
    };

    getAllGameLogs = async (lastSyncedDate) => {
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