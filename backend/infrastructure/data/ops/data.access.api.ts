import Mongoose = require("mongoose");
import { AppSettings } from './../../config/app.settings';

export class DataAccessApi {

    static dbInstance: any = null;
    static dbConnection: Mongoose.Connection;

    static connect(callback): Mongoose.Connection {

        if (this.dbInstance != null && this.dbInstance !== undefined) {
            return this.dbConnection;
        }

        this.dbConnection = Mongoose.connection;
        this.dbConnection.once("open", () => {
            if (this.dbInstance != null && this.dbInstance !== undefined) {
                return this.dbInstance;
            }
            console.log("App Database: Connection opened");
        });
        Mongoose.Promise =  require('bluebird');
        this.dbInstance = Mongoose.connect(AppSettings.APP_DB_CONNECTION_STRING, null, callback);

        return this.dbInstance;
    }
}

export const DataAccessApiStatus = DataAccessApi.connect(null);