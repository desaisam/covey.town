import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } from 'graphql';
import { UserType } from './typedefs/UserType';
import { pool } from './postgres/db'
import {nanoid} from 'nanoid';
import { RegisterResponseType } from './typedefs/RegisterResponseType';


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

async function checkIfUserAlreadyExists(email: string): Promise<boolean> {
  const response = await pool.query('SELECT * FROM userdata');
  const data = response.rows;
  const userFound = data.find(user => user.email === email);
  if (userFound) {
    return true;
  }
  return false;
}

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    registerUser: {
      type: RegisterResponseType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          const nousage = parent;
          // First check if user already registered
          const userExists = await checkIfUserAlreadyExists(args.email);
          if (userExists) {
            return {
              isSuccess: false,
              message: 'User already registered with this email. Please Login instead.'
            }
          }

          // Put this data in args to database
          await pool.query(`INSERT INTO userdata (email, name, password, avatar) VALUES ($1, $2, $3, $4)`, [args.email, args.name, args.password, 'avatar-1']);
          return {
            isSuccess: true,
            message: 'Successfully registered!'
          }
        } catch (e) {
          // Log error and return 'false' isSuccess with error message
          console.log(`Error in adding user to database. ${ e }`);
          return {
            isSuccess: false,
            message: 'Something went wrong. Please try again :('
          }
        }
      },
    },
  },
});

export const schema = new GraphQLSchema({ 
    query: RootQuery, 
    mutation: Mutation 
});
