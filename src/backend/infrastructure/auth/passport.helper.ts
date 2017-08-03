const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const passportJwtStrategy = require("passport-jwt").Strategy;
const passportExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

import { AppSettings } from "./../../infrastructure/config/app.settings";
import { AuthHelper } from './../../infrastructure/auth/auth.helper';
import { UserDataApi } from './../data/api/user.data.api';
import { User } from "./../data/models/user";

const passportJwtConfig: any = {};
passportJwtConfig.jwtFromRequest = passportExtractJwt.fromAuthHeader();
passportJwtConfig.secretOrKey = AppSettings.APP_API_JWT_SKEY;

export class PassportHelper {

    static initPassport() {
        passport.use('local-login', new Strategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
            function (req, username, password, done) {
                const userDataApi = new UserDataApi();
                userDataApi.retrieveByUsername(username, function (err, dbResult) {
                    if (err) {
                        return done(err);
                    } else if (dbResult != null && dbResult != null) {
                        AuthHelper.checkPasswordHash(password, dbResult.password, function (err, checkResult) {
                            if (err || checkResult === false) {
                                return done(null, false);
                            } else {
                                const minUserData = {
                                    id: dbResult._id,
                                    username: dbResult.username,
                                    roles: dbResult.roles
                                };
                                return done(null, minUserData);
                            }
                        });
                    } else {
                        done(null, false);
                    }
                });

            }));

        passport.serializeUser(function (user, done) {
            done(null, user.username);
        });

        passport.deserializeUser(function (id, done) {
            const userDataApi = new UserDataApi();
            userDataApi.retrieveByUsername(id, function (err, user) {
                const minUserData = {
                    id: user._id,
                    username: user.username,
                    roles: user.roles
                };
                done(err, minUserData);
            });
        });

        passport.use(new passportJwtStrategy(passportJwtConfig, function (jwt_data: any, next: any) {
            User.findOne({ _id: jwt_data.id }, function (err, user) {
                if (err) {
                    next(undefined, false);
                } else if (user) {
                    next(undefined, user);
                } else {
                    next(undefined, false);
                }
            });
        }));
    };

    static generateJwtToken(data: any) {
        return jwt.sign(data, passportJwtConfig.secretOrKey);
    }

}