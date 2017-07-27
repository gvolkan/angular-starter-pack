import path = require('path');
import express = require('express');
import bodyParser = require("body-parser");
import compression = require('compression');
import passport = require('passport');
import cookieParser = require('cookie-parser');
import helmet = require('helmet');
import flash = require('connect-flash');
import agenda = require('agenda');
import { printSchema } from "graphql";
import { schema } from "./graphql/schema/main.schema";
import expressGraphQL = require("express-graphql");

import { AppSettings } from './infrastructure/config/app.settings';
import { PassportHelper } from './infrastructure/auth/passport.helper';
import { AuthHelper } from './infrastructure/auth/auth.helper';
import { ApiRoutes } from './api/routes/all.routes';
import { DataOpsApi } from './infrastructure/data/ops/data.ops.api';
import { DataAccessApi } from './infrastructure/data/ops/data.access.api';
import { UserDataApi } from "./infrastructure/data/api/user.data.api";

let appStatus = false;

const app = express();
app.set('port', AppSettings.APP_SERVER_PORT);
app.use(compression());
app.use(flash());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.referrerPolicy({ policy: 'origin' }));
app.use(helmet.xssFilter());
app.use(helmet.dnsPrefetchControl());
if (AppSettings.APP_IN_PRODUCTION) {
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'fonts.gstatic.com'],
            fontSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', '*.google-analytics.com'],
            scriptSrc: ["'self'", '*.google-analytics.com', "'unsafe-eval'", "'unsafe-inline'"],
            mediaSrc: ["\'none\'"],
            childSrc: ["\'none\'"],
            objectSrc: ["\'none\'"]
        }
    }));
    const cookieSession = require('cookie-session');
    app.use(cookieSession({
        name: 'awpid',
        keys: [process.env.APP_SKEY1, process.env.APP_SKEY2],
        cookie: {
            secure: false,
            httpOnly: true
        }
    })
    );
} else {
    const expressSession = require('express-session');
    app.use(expressSession({
        name: 'awpid',
        secret: process.env.APP_SKEY1,
        resave: false,
        rolling: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true
        },
    }));
}

function prepareAuth() {
    PassportHelper.initPassport();
    app.use(passport.initialize());
    app.use(passport.session());

    // EXAMPLE JWT AUTH ROUTES
    if (!AppSettings.APP_IN_PRODUCTION) {
        app.post("/auth/jwt-token", function (req: any, res: any) {
            new UserDataApi().retrieveByUsername("admin",
                function (retError: any, retResult: any) {
                    if (retError) {
                        res.status(500).json({ message: "error" });
                    } else if (retResult !== undefined && retResult[0] !== undefined) {
                        AuthHelper.checkPasswordHash("test123", retResult[0].password,
                            function (checkErr: any, checkResult: any) {
                                if (checkErr || checkResult === false) {
                                    res.status(500).json({ message: "ERROR" });
                                } else {
                                    const data = { id: retResult[0]._id };
                                    const token = PassportHelper.generateJwtToken(data);
                                    res.json({ token: token });
                                }
                            });
                    } else {
                        res.status(401).json({ message: "USER NOT FOUND" });
                    }
                });
        });
        app.get("/auth/jwt-test",
            passport.authenticate("jwt", { session: false }),
            function (req: any, res: any) {
                res.status(200).json({ message: "OK" });
            });
    }
}
function prepareApi() {
    app.use("/api/", new ApiRoutes(express.Router()).routes);
}
function prepareGraphqlApi() {
    app.use(bodyParser.text({ type: "application/graphql" }));

    if (!AppSettings.APP_IN_PRODUCTION) {
        app.get("/api/graphql/schema", (req: any, res: any) => {
            res.setHeader("Content-type", "text/plain");
            res.send(printSchema(schema));
        });
    }
    app.use("/api/graphql", expressGraphQL(() => ({
        schema: schema,
        graphiql: !AppSettings.APP_IN_PRODUCTION,
        pretty: !AppSettings.APP_IN_PRODUCTION,
        formatError: (error: any) => ({
            message: error.message,
            state: error.originalError && error.originalError.state,
            locations: error.locations,
            path: error.path,
        }),
    })));
}
function prepareServices() {
    const agendaInstance: agenda = new agenda({
        db: {
            address: AppSettings.APP_DB_CONNECTION_STRING,
            collection: AppSettings.AGENDA_TABLE_NAME
        },
        processEvery: AppSettings.AGENDA_INTERVAL,
        defaultLockLifetime: AppSettings.AGENDA_TIMEOUT
    });
    agendaInstance.define('agenda_job_example', function (job, done) {
        // do something periodically
    });
}
function prepareDiagnosticsAndErrorHandling() {

    app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
        let err = new Error("Not Found");
        next(err);
    });

    if (!AppSettings.APP_IN_PRODUCTION) {
        app.use(function (err, req: express.Request, res: express.Response, next: express.NextFunction) {
            res.status(err.status || 500);
            res.json({
                error: err,
                message: err.message
            });
        });
    } else {
        app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            res.status(err.status || 500).json({ "error": true });
        });
    }

}
function prepareApps() {
    app.use('/assets/', express.static(path.resolve(__dirname, './../frontend/assets')));
    app.get('/robots.txt', (req: express.Request, res: express.Response) => {
        res.sendFile(path.resolve(__dirname, './../frontend/assets/docs/robots.txt'));
    });
    app.get('/*', (req: express.Request, res: express.Response) => {
        res.sendFile(path.resolve(__dirname, './../frontend/index.html'));
    });
}

DataAccessApi.dbConnection.on('connected', function () {
    console.log("App Database: Connection established");
    if (!appStatus && DataAccessApi.dbConnection.readyState === 1) {
        new DataOpsApi().init(() => {
            appStatus = true;
            prepareAuth();
            prepareApi();
            prepareGraphqlApi();
            prepareServices();
            prepareApps();
            prepareDiagnosticsAndErrorHandling();
        });
    }
});

DataAccessApi.dbConnection.on('error', function (err) {
    console.log("App Database: Error", JSON.stringify(err));
    app.get('/*', (req: express.Request, res: express.Response) => {
        res.status(500).send({
            "status": "Please try again later."
        });
    });
});

DataAccessApi.dbConnection.on('disconnected', function () {
    console.log("App Database: Connection closed");
});

export { app }
