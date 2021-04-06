import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } from 'graphql';
import { UserType } from './typedefs/UserType';
import { pool } from './postgres/db'
import {nanoid} from 'nanoid';


// some random data
// const userData = [
//     {
//         'id': 1,
//         'firstName': 'preet',
//         'lastName': 'shah',
//         'email': 'test@test.com',
//         'password': '12345'
//     },
// ]

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      args: { id: { type: GraphQLString } },
      // resolve(parent, args) {
      async resolve() {
        // Adding one random entry to DB
        const random = nanoid();
        const userData = {
          email: `test-${ random }@test.com`,
          name: `user-${ random }`,
          password: '12345',
          avatar: 'avatar-1'
        }
        await pool.query(`INSERT INTO userdata (email, name, password, avatar) VALUES ($1, $2, $3, $4)`, [userData.email, userData.name, userData.password, userData.avatar]);

        // Retrieve last added entry and return
        const data = await pool.query('SELECT * FROM userdata');
        const lastIndex = data.rowCount - 1;
        return [data.rows[lastIndex]];
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
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve() {
        console.log('inside mutation query - remove this once implemented');
        // userData.push({
        //   id: userData.length + 1,
        //   firstName: args.firstName,
        //   lastName: args.lastName,
        //   email: args.email,
        //   password: args.password,
        // });
        // return args;
      },
    },
  },
});

export const schema = new GraphQLSchema({ 
    query: RootQuery, 
    mutation: Mutation 
});
