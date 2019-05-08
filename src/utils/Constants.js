class Constants {
    static get DATA_TABLE_NAME() { return process.env.DATA_TABLE_NAME || "StlCardsDataTable" };
    static get PLAYER_TABLE_NAME() { return process.env.PLAYER_TABLE_NAME || "StlCardsPlayerTable" };
    static get LAST_SYNCED_DATE() { return "lastSyncedDate" };
    static get PLAYER_FIELDS() {
        return [
            "JerseyNumber",
            "Position",
            "Height",
            "Weight",
            "BirthDate",
            "Age",
            "officialImageSrc"
        ]
    };
}
module.exports = Constants;