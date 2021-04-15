import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql';

const SigninResponseType = new GraphQLObjectType({
  name: 'Login',
  fields: () => ({
    isSuccess: { type: GraphQLBoolean },
    message: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    avatar: { type: GraphQLString },
  }),
});

export default SigninResponseType;
