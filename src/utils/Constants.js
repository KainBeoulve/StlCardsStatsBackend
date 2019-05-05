export default class Constants {
    static DATA_TABLE_NAME = process.env.DATA_TABLE_NAME || "StlCardsDataTable";
    static PLAYER_TABLE_NAME = process.env.PLAYER_TABLE_NAME || "StlCardsPlayerTable";
    static PLAYER_FIELDS = [ "JerseyNumber", "Position", "Height", "Weight", "BirthDate", "Age", "officialImageSrc" ];
}