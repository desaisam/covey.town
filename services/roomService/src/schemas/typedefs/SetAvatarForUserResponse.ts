import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql';

const SetAvatarForUserResponse = new GraphQLObjectType({
  name: 'SetAvatarResponse',
  fields: () => ({
    isSuccess: { type: GraphQLBoolean },
    email: { type: GraphQLString },
    avatar: { type: GraphQLString },
  }),
});

export default SetAvatarForUserResponse;
