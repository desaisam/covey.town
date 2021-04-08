import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql';

export const LoginResponseType = new GraphQLObjectType({
  name: "Login",
  fields: () => ({
    isSuccess: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  }),
});