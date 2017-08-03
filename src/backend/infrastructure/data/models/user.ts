import mongoose = require("mongoose");
import { DataAccessApi } from './../ops/data.access.api';

export class UserClass {
    name: string;
    email: string;
    username: string;
    password: string;
    itemCreatedTimestamp: Date;
    itemCreatedByUser: any;
    itemUpdatedTimestamp: Date;
    itemUpdatedByUser: any;
    itemDeactivedTimestamp: Date;
    itemDeactivedByUser: any;
    itemId: string;
}

export interface IUserModel extends mongoose.Document {
    name: string;
    email: string;
    username: string;
    password: string;
    itemCreatedTimestamp: Date;
    itemCreatedByUser: any;
    itemUpdatedTimestamp: Date;
    itemUpdatedByUser: any;
    itemDeactivedTimestamp: Date;
    itemDeactivedByUser: any;
    itemId: string;
};

export class UserModel {

    private model: IUserModel;

    constructor(model: IUserModel) {
        this.model = model;
    }

    get name(): string {
        return this.model.name;
    }

    get email(): string {
        return this.model.email;
    }

    get username(): string {
        return this.model.username;
    }

    get password(): string {
        return this.model.password;
    }

    get itemCreatedTimestamp(): Date {
        return this.model.itemCreatedTimestamp;
    }

    get itemCreatedByUser(): IUserModel {
        return this.model.itemCreatedByUser;
    }

    get itemUpdatedTimestamp(): Date {
        return this.model.itemUpdatedTimestamp;
    }

    get itemUpdatedByUser(): IUserModel {
        return this.model.itemUpdatedByUser;
    }

    get itemDeactivedTimestamp(): Date {
        return this.model.itemDeactivedTimestamp;
    }

    get itemDeactivedByUser(): IUserModel {
        return this.model.itemDeactivedByUser;
    }

    get itemId(): string {
        return this.model.itemId;
    }
}

function getSchema() {
    if (DataAccessApi.dbInstance != null && DataAccessApi.dbInstance !== undefined) {
        return DataAccessApi.dbInstance.Schema({
            name: { type: String, required: false },
            email: { type: String, required: false },
            username: { type: String, required: true },
            password: { type: String, required: true },
            itemCreatedTimestamp: { type: Date, required: false, default: Date.now },
            itemCreatedByUser: { type: DataAccessApi.dbInstance.Schema.Types.ObjectId, ref: 'users', required: false },
            itemUpdatedTimestamp: { type: Date, required: false },
            itemUpdatedByUser: { type: DataAccessApi.dbInstance.Schema.Types.ObjectId, ref: 'users', required: false },
            itemDeactivedTimestamp: { type: Date, required: false },
            itemDeactivedByUser: { type: DataAccessApi.dbInstance.Schema.Types.ObjectId, ref: 'users', required: false },
            itemId: { type: String, required: false },
        });
    } else {
        return null;
    }
}

export const UserSchema = getSchema();

function getModel() {
    if (DataAccessApi.dbInstance != null && DataAccessApi.dbInstance !== undefined) {
        return DataAccessApi.dbConnection.model<IUserModel>('users', UserSchema);
    } else {
        return null;
    }
}

export const User = getModel();

import {
    // GraphQLSchema,
    // GraphQLList,
    // GraphQLEnumType,
    // GraphQLScalarType,
    // GraphQLInterfaceType,
    // GraphQLInputObjectType,
    // GraphQLUnionType,
    GraphQLObjectType,
    GraphQLNonNull,
    //GraphQLBoolean,
    GraphQLString,
    GraphQLID,
    //GraphQLInt,
    //GraphQLFloat
} from "graphql";
const GraphQLDate = require("graphql-date");

export const UserType: any = new GraphQLObjectType({
    name: "User",
    description: "User",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        itemCreatedTimestamp: { type: GraphQLDate },
        itemCreatedByUser: { type: UserType },
        itemUpdatedTimestamp: { type: GraphQLDate },
        itemUpdatedByUser: { type: UserType },
        itemDeactivedTimestamp: { type: GraphQLDate },
        itemDeactivedByUser: { type: UserType },
        itemId: { type: GraphQLString }
    })
});