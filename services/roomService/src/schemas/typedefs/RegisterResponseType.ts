import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql';

const RegisterResponseType = new GraphQLObjectType({
  name: 'Register',
  fields: () => ({
    isSuccess: { type: GraphQLBoolean },
    message: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    avatar: { type: GraphQLString },
  }),
});

export default RegisterResponseType;
