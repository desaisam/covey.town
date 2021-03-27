import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } from 'graphql';
import { UserType } from './typedefs/UserType';


// some random data
const userData = [
    {
        'id': 1,
        'firstName': 'preet',
        'lastName': 'shah',
        'email': 'test@test.com',
        'password': '12345'
    },
]

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      args: { id: { type: GraphQLInt } },
      // resolve(parent, args) {
      resolve() {
        return userData;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(args) {
        userData.push({
          id: userData.length + 1,
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          password: args.password,
        });
        return args;
      },
    },
  },
});

export const schema = new GraphQLSchema({ 
    query: RootQuery, 
    mutation: Mutation 
});
