import express = require("express");
import passport = require('passport');

export class UserController {

    logIn(req: express.Request, res: express.Response, next: express.NextFunction): void {
        passport.authenticate('local-login', function (err, user, info) {
            const status = {
                status: false,
                user: undefined,
                auth_error: err,
                redirect_to: undefined,
            };
            if (err || !user) {
                res.json(status);
            } else {
                req.logIn(user, function (err2) {
                    status.status = user !== undefined;
                    status.user = user;
                    status.auth_error = err2;
                    status.redirect_to = undefined;
                    if (req.body.rurl !== "") {
                        status.redirect_to = req.body.rurl;
                    }
                    res.json(status);
                });
            }
        })(req, res, next);
    }

    logOut(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const status = {
            status: false,
            user: undefined,
            auth_error: undefined,
            redirect_to: undefined,
        };
        req.logOut();
        if (req.body.rurl !== "") {
            status.redirect_to = req.body.rurl;
        }
        res.json(status);
    }

    status(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const status = {
            status: false,
            user: undefined
        };
        if (req.isAuthenticated()) {
            status.status = true;
            status.user = req.user;
            res.send(status);
        } else {
            res.send(status);
        }
    }
}
