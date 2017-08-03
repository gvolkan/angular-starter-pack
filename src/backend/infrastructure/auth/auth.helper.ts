import * as bcrypt from "bcrypt";
import * as express from "express";

export class AuthHelper {

    static isAuthenticated(req: express.Request, res: express.Response, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login?rurl=' + req.originalUrl);
        }
    }

    static isApiAuthenticated(req: express.Request, res: express.Response, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.status(401).send({
                message: 'Unauthorized.'
            });
        }
    }

    static generatePasswordHash(password: string, callback: (error: any, result: any) => void) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                callback(err, hash);
            });
        });
    }

    static checkPasswordHash(password: string, hash: string, callback: (error: any, result: any) => void) {
        bcrypt.compare(password, hash, function (err, res) {
            callback(err, res);
        });
    }
}