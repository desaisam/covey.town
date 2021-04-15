/* eslint no-console: ["error", { allow: ["log"] }] */
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
  console.log(`${email}: getting user from email`);
  const response = await pool.query('SELECT * FROM userdata');
  const data = response.rows;
  const registerdUser = data.find((user: GetUserResponse) => user.email === email);
  console.log(`${email}: found user with given email`);
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
        console.log(`${args.email}: received get avatar request`);
        try {
          if (args.email) {
            const user = await getUserFromEmail(args.email);
            if (user) {
              // user found
              const { avatar } = user;
              console.log(`${args.email}: Found ${avatar} for get avatar request`);
              if (avatar) {
                return {
                  isSuccess: true,
                  email: args.email,
                  avatar,
                };
              }
            } else {
              console.log(`${args.email}: no user for get avatar request`);
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
          console.log(`${args.email}: Error in getting avatar for user. ${e}`);
          return {
            isSuccess: false,
          };
        }
      },
    },
  },
});

async function checkIfUserAlreadyExists(email: string): Promise<boolean> {
  console.log(`${email}: checking if user exists`);
  const response = await pool.query('SELECT * FROM userdata');
  const data = response.rows;
  const userFound = data.find((user: GetUserResponse) => user.email === email);
  console.log(`${email}: checking if user exists, user found: ${userFound}`);
  if (userFound) {
    return true;
  }
  return false;
}

async function getExistingUser(email: string, password: string): Promise<GetUserResponse> {
  console.log(`${email}: getting existing user`);
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
          console.log(`${args.email}: received register request`);
          // First check if user already registered
          const userExists = await checkIfUserAlreadyExists(args.email);
          if (userExists) {
            console.log(`${args.email}: user exists for register request`);
            return {
              isSuccess: false,
              message: 'User already registered with this email. Please Login instead.',
            };
          }

          console.log(`${args.email}: adding to db for register request`);
          // Put this data in args to database
          await pool.query(
            'INSERT INTO userdata (email, name, password, avatar) VALUES ($1, $2, $3, $4)',
            [args.email, args.name, args.password, 'barmaid'],
          );
          console.log(`${args.email}: added to db, returning for register request`);
          return {
            isSuccess: true,
            message: 'Successfully registered!',
            name: args.name,
            email: args.email,
            avatar: 'barmaid',
          };
        } catch (e) {
          // Log error and return 'false' isSuccess with error message
          console.log(`Error in adding user: ${args.email} to database. ${e}`);
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
          console.log(`${args.email}: received login request`);
          const user = await getExistingUser(args.email, args.password);
          if (user === undefined) {
            console.log(`${args.email}: user not exists for login request`);
            return {
              isSuccess: false,
              message: 'User cannot be logged in. Please verify your credentials.',
            };
          }

          console.log(`${args.email}: returning for login request`);
          return {
            isSuccess: true,
            message: 'Successfully logged-in!',
            name: user.name,
            email: user.email,
          };
        } catch (e) {
          // Log error and return 'false' isSuccess with error message
          console.log(`Error in checking existing user: ${args.email} in database. ${e}`);
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
