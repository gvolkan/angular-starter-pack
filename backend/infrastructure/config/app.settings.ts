export class AppSettings {

    static APP_IN_PRODUCTION: boolean = process.env.NODE_ENV === "production" ? true : false;

    static APP_SERVER_PORT: any = process.env.APP_SERVER_PORT || 10000;
    static APP_DB_URI_ADDRESS: string = process.env.APP_DB_URI_ADDRESS;
    static APP_DB_URI_PORT: string = process.env.APP_DB_URI_PORT;
    static APP_DB_NAME: string = process.env.APP_DB_NAME;
    static APP_DB_AUTH_USERNAME: string = process.env.APP_DB_AUTH_USERNAME;
    static APP_DB_AUTH_PASSWORD: string = process.env.APP_DB_AUTH_PASSWORD;
    static APP_DB_AUTH_SOURCE: string = process.env.APP_DB_AUTH_SOURCE;

    static APP_DB_CONNECTION_ADDRESS: string = AppSettings.APP_DB_URI_ADDRESS + ":" +
    AppSettings.APP_DB_URI_PORT + "/" +
    AppSettings.APP_DB_NAME;
    static APP_DB_CONNECTION_AUTH: string =
    (AppSettings.APP_DB_AUTH_PASSWORD !== "" && AppSettings.APP_DB_AUTH_PASSWORD !== undefined) ?
        "mongodb://" + AppSettings.APP_DB_AUTH_USERNAME + ":" + AppSettings.APP_DB_AUTH_PASSWORD + "@" :
        "mongodb://";
    static APP_DB_CONNECTION_AUTH_SOURCE: string =
    (AppSettings.APP_DB_AUTH_SOURCE !== "" && AppSettings.APP_DB_AUTH_SOURCE !== undefined) ?
        "?authSource=" + AppSettings.APP_DB_AUTH_SOURCE :
        "";
    static APP_DB_CONNECTION_STRING: string = AppSettings.APP_DB_CONNECTION_AUTH +
    AppSettings.APP_DB_CONNECTION_ADDRESS +
    AppSettings.APP_DB_CONNECTION_AUTH_SOURCE;

    static APP_SKEY1: string = process.env.APP_SKEY1;
    static APP_SKEY2: string = process.env.APP_SKEY2;

    static APP_API_JWT_SKEY: string = process.env.APP_API_JWT_SKEY;

    static AGENDA_INTERVAL: string = "10 seconds";
    static AGENDA_TIMEOUT: number = 20000;
    static AGENDA_TABLE_NAME: string = "app_jobs";
}
