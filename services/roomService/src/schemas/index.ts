import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import pool from './postgres/db';
import GetAvatarForUserResponse from './typedefs/GetAvatarForUserResponse';
import SigninResponseType from './typedefs/LoginResponseType';
import RegisterResponseType from './typedefs/RegisterResponseType';
import SetAvatarForUserResponse from './typedefs/SetAvatarForUserResponse';

export interface GetUserResponse {
  avatar: string;
  email: string;
  name: string;
  password: string;
}

async function getUserFromEmail(email: string): Promise<GetUserResponse> {
  const response = await pool.query('SELECT * FROM userdata');
  const data = response.rows;
  const registerdUser = data.find((user: GetUserResponse) => user.email === email);
  return registerdUser;
}

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getAvatarForUser: {
      type: GetAvatarForUserResponse,
      args: {
        email: { type: GraphQLString },
      },
      async resolve(_, args) {
        try {
          if (args.email) {
            const user = await getUserFromEmail(args.email);
            if (user) {
              // user found
              const { avatar } = user;
              if (avatar) {
                return {
                  isSuccess: true,
                  email: args.email,
                  avatar,
                };
              }
            } else {
              // no user with matching email found
              return {
                isSuccess: false,
              };
            }
          }
          return {
            isSuccess: false,
          };
        } catch (e) {
          // console.log(`Error in getting avatar for user: ${args.userId}. ${e}`);
          return {
            isSuccess: false,
          };
        }
      },
    },
  },
});

async function checkIfUserAlreadyExists(email: string): Promise<boolean> {
  const response = await pool.query('SELECT * FROM userdata');
  const data = response.rows;
  const userFound = data.find((user: GetUserResponse) => user.email === email);
  if (userFound) {
    return true;
  }
  return false;
}

async function getExistingUser(email: string, password: string): Promise<GetUserResponse> {
  const response = await pool.query('SELECT * FROM userdata');
  const data = response.rows;
  const existingUser = data.find(
    (user: GetUserResponse) => user.email === email && user.password === password,
  );
  return existingUser;
}

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    registerUser: {
      type: RegisterResponseType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(_, args) {
        try {
          // First check if user already registered
          const userExists = await checkIfUserAlreadyExists(args.email);
          if (userExists) {
            return {
              isSuccess: false,
              message: 'User already registered with this email. Please Login instead.',
            };
          }

          // Put this data in args to database
          await pool.query(
            'INSERT INTO userdata (email, name, password, avatar) VALUES ($1, $2, $3, $4)',
            [args.email, args.name, args.password, 'barmaid'],
          );
          return {
            isSuccess: true,
            message: 'Successfully registered!',
            name: args.name,
            email: args.email,
            avatar: 'barmaid',
          };
        } catch (e) {
          // Log error and return 'false' isSuccess with error message
          // console.log(`Error in adding user: ${args.email} to database. ${e}`);
          return {
            isSuccess: false,
            message: 'Something went wrong. Please try again :(',
          };
        }
      },
    },
    loginUser: {
      type: SigninResponseType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(_, args) {
        try {
          // First check if user registered or not
          const user = await getExistingUser(args.email, args.password);
          if (user === undefined) {
            return {
              isSuccess: false,
              message: 'User cannot be logged in. Please verify your credentials.',
            };
          }

          return {
            isSuccess: true,
            message: 'Successfully logged-in!',
            name: user.name,
            email: user.email,
          };
        } catch (e) {
          // Log error and return 'false' isSuccess with error message
          // console.log(`Error in checking existing user: ${args.email} in database. ${e}`);
          return {
            isSuccess: false,
            message: 'Something went wrong. Please try again :(',
          };
        }
      },
    },
    setAvatarForUser: {
      type: SetAvatarForUserResponse,
      args: {
        email: { type: GraphQLString },
        avatar: { type: GraphQLString },
      },
      async resolve(_, args) {
        try {
          // First check if user already registered
          const userExists = await checkIfUserAlreadyExists(args.email);
          if (!userExists) {
            return {
              isSuccess: false,
            };
          }

          await pool.query('update userdata set avatar=($1) where email=($2)', [
            args.avatar,
            args.email,
          ]);
          return {
            isSuccess: true,
            email: args.email,
            avatar: args.avatar,
          };
        } catch (e) {
          // Log error and return 'false' isSuccess with error message
          // console.log(`Error in adding avatar for email: ${args.userId} to database. ${e}`);
          return {
            isSuccess: false,
          };
        }
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default schema;
