import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';

export const RegisterResponseType = new GraphQLObjectType({
  name: "Register",
  fields: () => ({
    isSuccess: { type: GraphQLBoolean },
    message: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    avatar: { type: GraphQLString },
  }),
});