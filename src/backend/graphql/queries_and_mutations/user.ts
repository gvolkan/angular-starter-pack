import {
    //GraphQLSchema,
    GraphQLList,
    // GraphQLEnumType,
    // GraphQLScalarType,
    // GraphQLInterfaceType,
    // GraphQLInputObjectType,
    // GraphQLUnionType,
    // GraphQLObjectType,
    GraphQLNonNull,
    //GraphQLBoolean,
    GraphQLString,
    //GraphQLID,
    GraphQLInt,
    //GraphQLFloat
} from "graphql";
//const GraphQLDate = require("graphql-date");

import { User, IUserModel, UserType } from "./../../infrastructure/data/models/user";

import { DataQueryApi } from "./../../graphql/data/data.query.api";
const dataQueryApi = new DataQueryApi<IUserModel>(User);

export const UserMutations = {
    addUser: {
        type: UserType,
        args: {
            name: {
                name: "name",
                type: new GraphQLNonNull(GraphQLString)
            },
            username: {
                name: "username",
                type: new GraphQLNonNull(GraphQLString)
            },
            email: {
                name: "email",
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: (root: any, {
            name,
            username,
            email
        }) => {
            const item = new User();
            item.name = name;
            item.username = username;
            item.email = email;
            return new Promise((resolve, reject) => {
                item.save((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        }
    }
};

export const UserQueries = {
    users: {
        type: new GraphQLList(UserType),
        args: {
            limit: { type: GraphQLInt }
        },
        resolve: (root: any, { limit }) => {
            return dataQueryApi.retrieve(undefined, undefined);
        }
    },
    user_by_username: {
        type: new GraphQLList(UserType),
        args: {
            username: { type: GraphQLString }
        },
        resolve: (root: any, { username }) => {
            return dataQueryApi.retrieve(undefined, undefined, { username: username }, undefined, "itemCreatedByUser");
        }
    }
};