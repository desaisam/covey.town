import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';

export const RegisterResponseType = new GraphQLObjectType({
  name: "Register",
  fields: () => ({
    isSuccess: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  }),
});