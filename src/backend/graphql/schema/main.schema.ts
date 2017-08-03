import {
    GraphQLSchema,
    GraphQLObjectType,
} from "graphql";

import { UserQueries, UserMutations } from "./../../graphql/queries_and_mutations/user";

const queries = new GraphQLObjectType({
    name: "query",
    fields: () => ({
        users: UserQueries.users,
        user_by_username: UserQueries.user_by_username
    })
});
const mutations = new GraphQLObjectType({
    name: "mutation",
    fields: () => ({
        addUser: UserMutations.addUser
    })
});
export const schema = new GraphQLSchema({
    query: queries,
    mutation: mutations
});
