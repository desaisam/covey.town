import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql';

export const GetAvatarForUserResponse = new GraphQLObjectType({
  name: "GetAvatarResponse",
  fields: () => ({
    isSuccess: { type: GraphQLBoolean },
    email: { type: GraphQLString },
    avatar: { type: GraphQLString },
  }),
});