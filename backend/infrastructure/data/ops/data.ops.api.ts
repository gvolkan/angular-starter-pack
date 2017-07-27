import { DataQueryApi } from './data.query.api';

import { AuthHelper } from './../../../infrastructure/auth/auth.helper';
import { StringHelper } from './../../../infrastructure/helpers/string.helper';

import { IUserModel, User, UserClass } from './../models/user';

export class DataOpsApi {

    private usersDataQueryApi: DataQueryApi<IUserModel>; settings;

    constructor() {
        this.usersDataQueryApi = new DataQueryApi<IUserModel>(User);
    }

    init(callback: () => void) {
        const thisRef = this;
        return this.usersDataQueryApi.retrieve((err, res) => {
            if (err === null && res != null && res.length === 0) {
                return AuthHelper.generatePasswordHash("test123", function (err, hash) {
                    const user = new UserClass();
                    user.username = "admin";
                    user.name = "admin";
                    user.password = hash;
                    user.email = "change@this.email";
                    user.itemId = StringHelper.getRandomCode(6, true);
                    thisRef.usersDataQueryApi.create(<IUserModel>user, (err2, res) => {
                        callback();
                    });
                });
            } else {
                callback();
            }
        });
    }
}