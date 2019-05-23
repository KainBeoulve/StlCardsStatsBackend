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

            // This takes care of doubleheaders, they will be treated as cumulative for a day
            const sortedRecordsWithoutDuplicates = [];

            for (let i = 0; i < sortedGameRecords.length; i++) {

                if (i !== sortedGameRecords.length-1 ) {
                    if (sortedGameRecords[i].Date === sortedGameRecords[i + 1].Date) {
                        continue;
                    }
                }

                if (i !== 0 ) {
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

            const stats = {
                gameDates: [],
                atBats: [],
                plateAppearances: [],
                hits: [],
                hitByPitch: [],
                runsScored: [],
                runsBattedIn: [],
                walks: [],
                strikeouts: [],
                sacrificeFlies: [],
                totalBases: [],
                battingAverage: [],
                sluggingPercentage: [],
                onBasePercentage: [],
                onBasePlusSluggingPercentage: []
            };

            // TODO: Clean this up, use constants and foreach
            sortedRecordsWithoutDuplicates.forEach(record => {
                if (stats.atBats.length === 0) {
                    stats.atBats.push(record.AtBats);
                    stats.plateAppearances.push(record.PlateAppearances);
                    stats.hits.push(record.Hits);
                    stats.hitByPitch.push(record.HitByPitch);
                    stats.runsScored.push(record.Runs);
                    stats.runsBattedIn.push(record.RunsBattedIn);
                    stats.walks.push(record.BatterWalks);
                    stats.strikeouts.push(record.BatterStrikeouts);
                    stats.sacrificeFlies.push(record.BatterSacrificeFlies);
                    stats.totalBases.push(record.TotalBases);
                } else {
                    stats.atBats.push(HelperFunctions.getLastEntry(stats.atBats) + record.AtBats);
                    stats.plateAppearances.push(HelperFunctions.getLastEntry(stats.plateAppearances) + record.PlateAppearances);
                    stats.hits.push(HelperFunctions.getLastEntry(stats.hits) + record.Hits);
                    stats.hitByPitch.push(HelperFunctions.getLastEntry(stats.hitByPitch) + record.HitByPitch);
                    stats.runsScored.push(HelperFunctions.getLastEntry(stats.runsScored) + record.Runs);
                    stats.runsBattedIn.push(HelperFunctions.getLastEntry(stats.runsBattedIn) + record.RunsBattedIn);
                    stats.walks.push(HelperFunctions.getLastEntry(stats.walks) + record.BatterWalks);
                    stats.strikeouts.push(HelperFunctions.getLastEntry(stats.strikeouts) + record.BatterStrikeouts);
                    stats.sacrificeFlies.push(HelperFunctions.getLastEntry(stats.sacrificeFlies) + record.BatterSacrificeFlies);
                    stats.totalBases.push(HelperFunctions.getLastEntry(stats.totalBases) + record.TotalBases);
                }
                stats.gameDates.push(record.Date);
                stats.battingAverage.push(StatisticsHandler.calculateBattingStatistic(stats, Constants.STATISTICS.battingAverage));
                stats.onBasePercentage.push(StatisticsHandler.calculateBattingStatistic(stats, Constants.STATISTICS.onBasePercentage));
                stats.sluggingPercentage.push(StatisticsHandler.calculateBattingStatistic(stats, Constants.STATISTICS.sluggingPercentage));
                stats.onBasePlusSluggingPercentage.push(StatisticsHandler.calculateBattingStatistic(stats, Constants.STATISTICS.onBasePlusSluggingPercentage));
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
            case Constants.STATISTICS.battingAverage:
                if (atBats) {
                    return HelperFunctions.getLastEntry(stats.hits)/atBats;
                }
                return 0;
            case Constants.STATISTICS.onBasePercentage:
                const hbp = HelperFunctions.getLastEntry(stats.hitByPitch);
                const walks = HelperFunctions.getLastEntry(stats.walks);
                const denominator = parseFloat(HelperFunctions.getLastEntry(stats.atBats) + walks +
                    hbp + HelperFunctions.getLastEntry(stats.sacrificeFlies));
                if (denominator) {
                    return (HelperFunctions.getLastEntry(stats.hits) + walks + hbp) / denominator;
                }
                return 0;
            case Constants.STATISTICS.sluggingPercentage:
                if (atBats) {
                    return HelperFunctions.getLastEntry(stats.totalBases)/atBats;
                }
                return 0;
            case Constants.STATISTICS.onBasePlusSluggingPercentage:
                return HelperFunctions.getLastEntry(stats.onBasePercentage) + HelperFunctions.getLastEntry(stats.sluggingPercentage);
            default:
                console.error(`Invalid statistic to calculate: ${statistic}`);
                throw new Error(Constants.ERRORS.statisticError);
        }
    };
}
module.exports = StatisticsHandler;