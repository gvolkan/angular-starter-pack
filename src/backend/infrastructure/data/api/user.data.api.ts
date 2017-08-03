import { DataQueryApi } from './../ops/data.query.api';
import { IUserModel, User } from './../models/user';
import { AuthHelper } from './../../../infrastructure/auth/auth.helper';
import { StringHelper } from './../../../infrastructure/helpers/string.helper';

export class UserDataApi {

    private DataQueryApi: DataQueryApi<IUserModel>;
    private populate: string = 'itemCreatedByUser itemUpdatedByUser itemDeactivedByUser';

    constructor() {
        this.DataQueryApi = new DataQueryApi<IUserModel>(User);
    }

    create(item: IUserModel,
        callback: (error: any, result: any) => void) {
        item.itemId = StringHelper.getRandomCode(6, true);
        this.DataQueryApi.create(item, callback);
    }

    update(id: string, item: IUserModel,
        callback: (error: any, result: IUserModel) => void) {
        const api = this.DataQueryApi;
        this.retrieveById(id, (err: any, res: any) => {
            if (err) {
                callback(err, res);
            } else {
                if (item.password !== undefined && item.password !== undefined) {
                    AuthHelper.generatePasswordHash(item.password, function (err: any, result: any) {
                        item.password = result;
                        api.update(res._id, item, callback);
                    });
                } else {
                    item.password = res.password;
                    api.update(res._id, item, callback);
                }
            }
        });
    }

    delete(id: string, item: IUserModel,
        callback: (error: any, result: any) => void) {
        this.retrieveById(id, (err: any, res: any) => {
            if (err) {
                callback(err, res);
            } else {
                this.DataQueryApi.delete(res._id, item, callback);
            }
        });
    }

    retrieve(isPublished: boolean,
        callback: (error: any, result: any[]) => void,
        limit?: number, skip: number = 0, sort: any = { itemCreatedTimestamp: -1 }) {
        this.DataQueryApi.retrieve(
            callback,
            limit,
            skip,
            {
                itemPublished: isPublished,
                itemDeactivedTimestamp: { $exists: false }
            },
            sort,
            this.populate
        );
    }

    retrieveById(id: any,
        callback: (error: any, result: any) => void) {
        this.DataQueryApi.retrieveOne(
            callback,
            {
                _id: id,
                itemDeactivedTimestamp: { $exists: false }
            },
            this.populate
        );
    }

    retrieveByItemId(itemId: any,
        callback: (error: any, result: any) => void) {
        this.DataQueryApi.retrieveOne(
            callback,
            {
                itemId: itemId,
                itemDeactivedTimestamp: { $exists: false }
            },
            this.populate
        );
    }

    retrieveByUsername(username: string,
        callback: (error: any, result: any) => void) {
        this.DataQueryApi.retrieveOne(
            callback,
            {
                username: username,
                itemDeactivedTimestamp: { $exists: false }
            },
            this.populate
        );
    }
}
