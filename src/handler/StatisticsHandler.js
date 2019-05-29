const Constants = require("../utils/Constants");
const DynamoDBClient = require("../client/DynamoDBClient");
const HelperFunctions = require("../utils/HelperFunctions");

class StatisticsHandler {
    static async calculatePlayerBattingStatistics(playerName) {
        if (playerName) {
            const dynamoDBClient = new DynamoDBClient();
            const data = await dynamoDBClient.queryStatsForPlayer(playerName);

            // Sort by Dates
            const sortedGameRecords = data.Items.sort((a, b) => a.Date - b.Date);

            const sortedRecordsWithoutDuplicates = [];

            // This loop takes care of doubleheaders, they will be treated as cumulative for a day
            for (let i = 0; i < sortedGameRecords.length; i++) {
                if (i !== sortedGameRecords.length-1 ) {
                    if (sortedGameRecords[i].Date === sortedGameRecords[i + 1].Date) {
                        continue;
                    }
                }

                if (i !== 0) {
                    if (sortedGameRecords[i - 1].Date === sortedGameRecords[i].Date) {
                        const combinedStatsObject = {};
                        Object.keys(sortedGameRecords[i]).forEach(key => {
                            if (key === "Date") {
                                combinedStatsObject[key] = sortedGameRecords[i][key];
                            } else {
                                combinedStatsObject[key] = sortedGameRecords[i][key] + sortedGameRecords[i - 1][key];
                            }
                        });
                        sortedRecordsWithoutDuplicates.push(combinedStatsObject);
                        continue;
                    }
                }
                sortedRecordsWithoutDuplicates.push(sortedGameRecords[i]);
            }

            // Instantiate the statistics object
            const stats = {
                gameDates: []
            };

            // Add all statistics to the returned object
            sortedRecordsWithoutDuplicates.forEach(record => {
                // Add the game date to the gameDates array
                stats.gameDates.push(record.Date);

                // Add the raw statistics for this record (cumulative if past the first entry)
                Object.keys(Constants.RAW_STATISTICS).forEach(key => {
                    if (!stats[key]) {
                        const newStat = [];
                        newStat.push(record[Constants.RAW_STATISTICS[key]]);
                        stats[key] = newStat;
                    } else {
                        stats[key].push(HelperFunctions.getLastEntry(stats[key]) + record[Constants.RAW_STATISTICS[key]]);
                    }
                });

                // Add the calculated statistics for this record
                Object.keys(Constants.CALCULATED_STATISTICS).forEach(key => {
                    if (!stats[key]) {
                        const newStat = [];
                        newStat.push(StatisticsHandler.calculateBattingStatistic(stats, Constants.CALCULATED_STATISTICS[key]));
                        stats[key] = newStat;
                    } else {
                        stats[key].push(StatisticsHandler.calculateBattingStatistic(stats, Constants.CALCULATED_STATISTICS[key]));
                    }
                });
            });

            return stats;
        } else {
            console.error("Null or undefined player name.");
            throw new Error(Constants.ERRORS.statisticError);
        }
    };

    /**
     * Function that calculates various batting statistics
     * @param stats: array of raw data
     * @param statistic: String identifier of statistic to be calculated
     * @returns {number|*} value of the statistic
     */
    static calculateBattingStatistic(stats, statistic) {
        let atBats = parseFloat(HelperFunctions.getLastEntry(stats.atBats));
        switch(statistic) {
            case Constants.CALCULATED_STATISTICS.battingAverage:
                if (atBats) {
                    return HelperFunctions.getLastEntry(stats.hits)/atBats;
                }
                return 0;
            case Constants.CALCULATED_STATISTICS.onBasePercentage:
                const hbp = HelperFunctions.getLastEntry(stats.hitByPitch);
                const walks = HelperFunctions.getLastEntry(stats.walks);
                const denominator = parseFloat(HelperFunctions.getLastEntry(stats.atBats) + walks +
                    hbp + HelperFunctions.getLastEntry(stats.sacrificeFlies));
                if (denominator) {
                    return (HelperFunctions.getLastEntry(stats.hits) + walks + hbp) / denominator;
                }
                return 0;
            case Constants.CALCULATED_STATISTICS.sluggingPercentage:
                if (atBats) {
                    return HelperFunctions.getLastEntry(stats.totalBases)/atBats;
                }
                return 0;
            case Constants.CALCULATED_STATISTICS.onBasePlusSluggingPercentage:
                return HelperFunctions.getLastEntry(stats.onBasePercentage) + HelperFunctions.getLastEntry(stats.sluggingPercentage);
            default:
                console.error(`Invalid statistic to calculate: ${statistic}`);
                throw new Error(Constants.ERRORS.statisticError);
        }
    };
}
module.exports = StatisticsHandler;