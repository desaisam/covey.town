import assert from 'assert';
import CORS from 'cors';
import Express from 'express';
import http from 'http';
import { nanoid } from 'nanoid';
import { AddressInfo } from 'net';
import addTownRoutes from '../router/towns';
import TownsServiceClient, { TownListResponse } from './TownsServiceClient';

type TestTownData = {
  friendlyName: string;
  coveyTownID: string;
  isPubliclyListed: boolean;
  townUpdatePassword: string;
};

function expectTownListMatches(towns: TownListResponse, town: TestTownData) {
  const matching = towns.towns.find(townInfo => townInfo.coveyTownID === town.coveyTownID);
  if (town.isPubliclyListed) {
    expect(matching).toBeDefined();
    assert(matching);
    expect(matching.friendlyName).toBe(town.friendlyName);
  } else {
    expect(matching).toBeUndefined();
  }
}

describe('TownsServiceAPIREST', () => {
  let server: http.Server;
  let apiClient: TownsServiceClient;
  async function createTownForTesting(
    friendlyNameToUse?: string,
    isPublic = false,
  ): Promise<TestTownData> {
    const friendlyName =
      friendlyNameToUse !== undefined
        ? friendlyNameToUse
        : `${isPublic ? 'Public' : 'Private'}TestingTown=${nanoid()}`;
    const ret = await apiClient.createTown({
      friendlyName,
      isPubliclyListed: isPublic,
    });
    return {
      friendlyName,
      isPubliclyListed: isPublic,
      coveyTownID: ret.coveyTownID,
      townUpdatePassword: ret.coveyTownPassword,
    };
  }

  beforeAll(async () => {
    const app = Express();
    app.use(CORS());
    server = http.createServer(app);

    addTownRoutes(server, app);
    await server.listen();
    const address = server.address() as AddressInfo;

    apiClient = new TownsServiceClient(`http://127.0.0.1:${address.port}`);
  });
  afterAll(async () => {
    await server.close();
  });
  describe('CoveyTownCreateAPI', () => {
    it('Allows for multiple towns with the same friendlyName', async () => {
      const firstTown = await createTownForTesting();
      const secondTown = await createTownForTesting(firstTown.friendlyName);
      expect(firstTown.coveyTownID).not.toBe(secondTown.coveyTownID);
    });
    it('Prohibits a blank friendlyName', async () => {
      try {
        await createTownForTesting('');
        fail('createTown should throw an error if friendly name is empty string');
      } catch (err) {
        // OK
      }
    });
  });

  describe('CoveyTownListAPI', () => {
    it('Lists public towns, but not private towns', async () => {
      const pubTown1 = await createTownForTesting(undefined, true);
      const privTown1 = await createTownForTesting(undefined, false);
      const pubTown2 = await createTownForTesting(undefined, true);
      const privTown2 = await createTownForTesting(undefined, false);

      const towns = await apiClient.listTowns();
      expectTownListMatches(towns, pubTown1);
      expectTownListMatches(towns, pubTown2);
      expectTownListMatches(towns, privTown1);
      expectTownListMatches(towns, privTown2);
    });
    it('Allows for multiple towns with the same friendlyName', async () => {
      const pubTown1 = await createTownForTesting(undefined, true);
      const privTown1 = await createTownForTesting(pubTown1.friendlyName, false);
      const pubTown2 = await createTownForTesting(pubTown1.friendlyName, true);
      const privTown2 = await createTownForTesting(pubTown1.friendlyName, false);

      const towns = await apiClient.listTowns();
      expectTownListMatches(towns, pubTown1);
      expectTownListMatches(towns, pubTown2);
      expectTownListMatches(towns, privTown1);
      expectTownListMatches(towns, privTown2);
    });
  });

  describe('CoveyTownDeleteAPI', () => {
    it('Throws an error if the password is invalid', async () => {
      const { coveyTownID } = await createTownForTesting(undefined, true);
      try {
        await apiClient.deleteTown({
          coveyTownID,
          coveyTownPassword: nanoid(),
        });
        fail('Expected deleteTown to throw an error');
      } catch (e) {
        // Expected error
      }
    });
    it('Throws an error if the townID is invalid', async () => {
      const { townUpdatePassword } = await createTownForTesting(undefined, true);
      try {
        await apiClient.deleteTown({
          coveyTownID: nanoid(),
          coveyTownPassword: townUpdatePassword,
        });
        fail('Expected deleteTown to throw an error');
      } catch (e) {
        // Expected error
      }
    });
    it('Deletes a town if given a valid password and town, no longer allowing it to be joined or listed', async () => {
      const { coveyTownID, townUpdatePassword } = await createTownForTesting(undefined, true);
      await apiClient.deleteTown({
        coveyTownID,
        coveyTownPassword: townUpdatePassword,
      });
      try {
        await apiClient.joinTown({
          userName: nanoid(),
          coveyTownID,
        });
        fail('Expected joinTown to throw an error');
      } catch (e) {
        // Expected
      }
      const listedTowns = await apiClient.listTowns();
      if (listedTowns.towns.find(r => r.coveyTownID === coveyTownID)) {
        fail('Expected the deleted town to no longer be listed');
      }
    });
  });
  describe('CoveyTownUpdateAPI', () => {
    it('Checks the password before updating any values', async () => {
      const pubTown1 = await createTownForTesting(undefined, true);
      expectTownListMatches(await apiClient.listTowns(), pubTown1);
      try {
        await apiClient.updateTown({
          coveyTownID: pubTown1.coveyTownID,
          coveyTownPassword: `${pubTown1.townUpdatePassword}*`,
          friendlyName: 'broken',
          isPubliclyListed: false,
        });
        fail('updateTown with an invalid password should throw an error');
      } catch (err) {
        // err expected
        // TODO this should really check to make sure it's the *right* error, but we didn't specify
        // the format of the exception :(
      }

      // Make sure name or vis didn't change
      expectTownListMatches(await apiClient.listTowns(), pubTown1);
    });
    it('Updates the friendlyName and visbility as requested', async () => {
      const pubTown1 = await createTownForTesting(undefined, false);
      expectTownListMatches(await apiClient.listTowns(), pubTown1);
      await apiClient.updateTown({
        coveyTownID: pubTown1.coveyTownID,
        coveyTownPassword: pubTown1.townUpdatePassword,
        friendlyName: 'newName',
        isPubliclyListed: true,
      });
      pubTown1.friendlyName = 'newName';
      pubTown1.isPubliclyListed = true;
      expectTownListMatches(await apiClient.listTowns(), pubTown1);
    });
    it('Does not update the visibility if visibility is undefined', async () => {
      const pubTown1 = await createTownForTesting(undefined, true);
      expectTownListMatches(await apiClient.listTowns(), pubTown1);
      await apiClient.updateTown({
        coveyTownID: pubTown1.coveyTownID,
        coveyTownPassword: pubTown1.townUpdatePassword,
        friendlyName: 'newName2',
      });
      pubTown1.friendlyName = 'newName2';
      expectTownListMatches(await apiClient.listTowns(), pubTown1);
    });
  });

  describe('CoveyMemberAPI', () => {
    it('Throws an error if the town does not exist', async () => {
      await createTownForTesting(undefined, true);
      try {
        await apiClient.joinTown({
          userName: nanoid(),
          coveyTownID: nanoid(),
        });
        fail('Expected an error to be thrown by joinTown but none thrown');
      } catch (err) {
        // OK, expected an error
        // TODO this should really check to make sure it's the *right* error, but we didn't specify
        // the format of the exception :(
      }
    });
    it('Admits a user to a valid public or private town', async () => {
      const pubTown1 = await createTownForTesting(undefined, true);
      const privTown1 = await createTownForTesting(undefined, false);
      const res = await apiClient.joinTown({
        userName: nanoid(),
        coveyTownID: pubTown1.coveyTownID,
      });
      expect(res.coveySessionToken).toBeDefined();
      expect(res.coveyUserID).toBeDefined();

      const res2 = await apiClient.joinTown({
        userName: nanoid(),
        coveyTownID: privTown1.coveyTownID,
      });
      expect(res2.coveySessionToken).toBeDefined();
      expect(res2.coveyUserID).toBeDefined();
    });
  });

  describe('CoveyRegistrationAPI', () => {
    describe('CoveyRegistrationAPI', () => {
      it('New user should be able to register with valid username, email and password', async () => {
        const rand = nanoid();
        const email = `${rand}@domain.com`;
        const query = `
          mutation {
            registerUser(name: "admin1", email: "${email}", password: "admin123") {
              isSuccess,
              message,
              name,
              email,
              avatar
            }
          }
        `;
        // Make api call here
        const response = await apiClient.handleRegisterSubmit(query);
        // Verify response
        expect(response.isSuccess).toBe(true);
        expect(response.message).toBe('Successfully registered!');
        expect(response.name).toBe('admin1');
        expect(response.email).toBe(email);
        expect(response.avatar).toBe('barmaid');
      });
      it('User should NOT be able to register with a previously registered email', async () => {
        const rand = nanoid();
        const email = `${rand}@domain.com`;
        const query = `
          mutation {
            registerUser(name: "admin1", email: "${email}", password: "admin123") {
              isSuccess,
              message,
              name,
              email,
              avatar
            }
          }
        `;
        // Make api call here
        const response = await apiClient.handleRegisterSubmit(query);
        // Verify response
        expect(response.isSuccess).toBe(true);
        expect(response.message).toBe('Successfully registered!');
        expect(response.name).toBe('admin1');
        expect(response.email).toBe(email);
        expect(response.avatar).toBe('barmaid');

        // Try to register a user with the same email
        const query2 = `
          mutation {
            registerUser(name: "admin1", email: "${email}", password: "admin123") {
              isSuccess,
              message,
              name,
              email,
              avatar
            }
          }
        `;
        // Make api call here
        const response2 = await apiClient.handleRegisterSubmit(query2);
        // Verify response
        expect(response2.isSuccess).toBe(false);
        expect(response2.message).toBe(
          'User already registered with this email. Please Login instead.',
        );
      });
      it('Two users with same names but different email can register', async () => {
        const rand = nanoid();
        const email = `${rand}@domain.com`;
        const query = `
          mutation {
            registerUser(name: "admin1", email: "${email}", password: "admin123") {
              isSuccess,
              message,
              name,
              email,
              avatar
            }
          }
        `;
        // Make api call here
        const response = await apiClient.handleRegisterSubmit(query);
        // Verify response
        expect(response.isSuccess).toBe(true);
        expect(response.message).toBe('Successfully registered!');
        expect(response.name).toBe('admin1');
        expect(response.email).toBe(email);
        expect(response.avatar).toBe('barmaid');

        const rand2 = nanoid();
        const email2 = `${rand2}@domain.com`;
        const query2 = `
          mutation {
            registerUser(name: "admin1", email: "${email2}", password: "admin123") {
              isSuccess,
              message,
              name,
              email,
              avatar
            }
          }
        `;
        // Make api call here
        const response2 = await apiClient.handleRegisterSubmit(query2);
        // Verify response
        expect(response2.isSuccess).toBe(true);
        expect(response2.message).toBe('Successfully registered!');
        expect(response2.name).toBe('admin1');
        expect(response2.email).toBe(email2);
        expect(response2.avatar).toBe('barmaid');
      });
    });

    describe('CoveyLoginAPI', () => {
      it('Exisiting User should be able to login with valid credentials', async () => {
        // Register a user
        const rand = nanoid();
        const email = `${rand}@domain.com`;
        const query = `
          mutation {
            registerUser(name: "admin1", email: "${email}", password: "admin123") {
              isSuccess,
              message,
              name,
              email,
              avatar
            }
          }
        `;
        // Make api call here
        const response = await apiClient.handleRegisterSubmit(query);
        // Verify response
        expect(response.isSuccess).toBe(true);
        expect(response.message).toBe('Successfully registered!');
        expect(response.name).toBe('admin1');
        expect(response.email).toBe(email);
        expect(response.avatar).toBe('barmaid');

        // Login with that user
        const query2 = `
        mutation {
          loginUser(email: "${email}", password: "admin123") {
            isSuccess,
            message,
            name,
            email,
            avatar
          }
        }
      `;

        // Make api call here
        const response2 = await apiClient.handleLoginSubmit(query2);
        // Verify response
        expect(response2.isSuccess).toBe(true);
        expect(response2.message).toBe('Successfully logged-in!');
        expect(response2.name).toBe('admin1');
        expect(response2.email).toBe(email);
      });

      it('Exisiting User should NOT be able to login with both invalid credentials', async () => {
        // Register a user
        const rand = nanoid();
        const email = `${rand}@domain.com`;
        const query = `
          mutation {
            registerUser(name: "admin1", email: "${email}", password: "admin123") {
              isSuccess,
              message,
              name,
              email,
              avatar
            }
          }
        `;
        // Make api call here
        const response = await apiClient.handleRegisterSubmit(query);
        // Verify response
        expect(response.isSuccess).toBe(true);
        expect(response.message).toBe('Successfully registered!');
        expect(response.name).toBe('admin1');
        expect(response.email).toBe(email);
        expect(response.avatar).toBe('barmaid');

        // Login an existing user created above with invalid credentials
        const query2 = `
        mutation {
          loginUser(email: "${email}", password: "wrongAdmin123") {
            isSuccess,
            message,
            name,
            email,
            avatar
          }
        }
      `;

        // Make api call here
        const response2 = await apiClient.handleLoginSubmit(query2);
        // Verify response
        expect(response2.isSuccess).toBe(false);
        expect(response2.message).toBe('User cannot be logged in. Please verify your credentials.');
      });

      it('Exisiting User should NOT be able to login with invalid username, but valid password', async () => {
        // Register a user
        const rand = nanoid();
        const email = `${rand}@domain.com`;
        const query = `
          mutation {
            registerUser(name: "admin1", email: "${email}", password: "admin123") {
              isSuccess,
              message,
              name,
              email,
              avatar
            }
          }
        `;
        // Make api call here
        const response = await apiClient.handleRegisterSubmit(query);
        // Verify response
        expect(response.isSuccess).toBe(true);
        expect(response.message).toBe('Successfully registered!');
        expect(response.name).toBe('admin1');
        expect(response.email).toBe(email);
        expect(response.avatar).toBe('barmaid');

        // Login with that user
        const query2 = `
        mutation {
          loginUser(email: "wrongAdmin@domain.com", password: "admin123") {
            isSuccess,
            message,
            name,
            email,
            avatar
          }
        }
      `;

        // Make api call here
        const response2 = await apiClient.handleLoginSubmit(query2);
        // Verify response
        expect(response2.isSuccess).toBe(false);
        expect(response2.message).toBe('User cannot be logged in. Please verify your credentials.');
      });

      it('Exisiting User should NOT be able to login with valid username, invalid password', async () => {
        // Register a user
        const rand = nanoid();
        const email = `${rand}@domain.com`;
        const query = `
          mutation {
            registerUser(name: "admin1", email: "${email}", password: "admin123") {
              isSuccess,
              message,
              name,
              email,
              avatar
            }
          }
        `;
        // Make api call here
        const response = await apiClient.handleRegisterSubmit(query);
        // Verify response
        expect(response.isSuccess).toBe(true);
        expect(response.message).toBe('Successfully registered!');
        expect(response.name).toBe('admin1');
        expect(response.email).toBe(email);
        expect(response.avatar).toBe('barmaid');

        // Login with that user
        const query2 = `
        mutation {
          loginUser(email: "${email}", password: "wrongAdmin123") {
            isSuccess,
            message,
            name,
            email,
            avatar
          }
        }
      `;

        // Make api call here
        const response2 = await apiClient.handleLoginSubmit(query2);
        // Verify response
        expect(response2.isSuccess).toBe(false);
        expect(response2.message).toBe('User cannot be logged in. Please verify your credentials.');
      });

      it('New User should NOT be able to login without registering', async () => {
        // Login with a user that does not exist
        const query2 = `
        mutation {
          loginUser(email: "newAdmin@domain.com", password: "newAdmin123") {
            isSuccess,
            message,
            name,
            email,
            avatar
          }
        }
      `;

        // Make api call here
        const response2 = await apiClient.handleLoginSubmit(query2);
        // Verify response
        expect(response2.isSuccess).toBe(false);
        expect(response2.message).toBe('User cannot be logged in. Please verify your credentials.');
      });
    });

    describe('SetAvatarAPI', () => {
      it('User should be able to set or change his/her new avatar', async () => {
        // Register a new User
        const rand = nanoid();
        const email = `${rand}@domain.com`;
        const query = `
          mutation {
            registerUser(name: "admin1", email: "${email}", password: "admin123") {
              isSuccess,
              message,
              name,
              email,
              avatar
            }
          }
        `;
        // Make api call here
        const response = await apiClient.handleRegisterSubmit(query);
        // Verify response
        expect(response.isSuccess).toBe(true);
        expect(response.message).toBe('Successfully registered!');
        expect(response.name).toBe('admin1');
        expect(response.email).toBe(email);
        expect(response.avatar).toBe('barmaid');

        // Change the avatar
        const query2 = `
        mutation {
          setAvatarForUser(email: "${email}", avatar: "granny") {
            isSuccess,
            email,
            avatar
          }
        }
      `;
        // Make api call here
        const response2 = await apiClient.setAvatarForUser(query2);
        expect(response2.isSuccess).toBe(true);
        expect(response2.avatar).toBe('granny');
      });
      it('User should NOT be able to set an avatar without registering first', async () => {
        // Change the avatar without registering
        const query2 = `
        mutation {
          setAvatarForUser(email: "admin7@domain7.com", avatar: "granny") {
            isSuccess,
            email,
            avatar
          }
        }
      `;
        // Make api call here
        const response2 = await apiClient.setAvatarForUser(query2);
        expect(response2.isSuccess).toBe(false);
      });
    });

    describe('GetAvatarAPI', () => {
      it('User should be able to retrieve the newly set avatar from the database', async () => {
        const rand = nanoid();
        const email = `${rand}@domain.com`;
        const query = `
          mutation {
            registerUser(name: "admin1", email: "${email}", password: "admin123") {
              isSuccess,
              message,
              name,
              email,
              avatar
            }
          }
        `;
        // Make api call here
        const response = await apiClient.handleRegisterSubmit(query);
        // Verify response
        expect(response.isSuccess).toBe(true);
        expect(response.message).toBe('Successfully registered!');
        expect(response.name).toBe('admin1');
        expect(response.email).toBe(email);
        expect(response.avatar).toBe('barmaid');

        // Change the avatar
        const query2 = `
        mutation {
          setAvatarForUser(email: "${email}", avatar: "granny") {
            isSuccess,
            email,
            avatar
          }
        }
      `;
        // Make api call here
        const response2 = await apiClient.setAvatarForUser(query2);
        expect(response2.isSuccess).toBe(true);
        expect(response2.avatar).toBe('granny');

        // Get the new Avatar
        const query3 = `
        query {
          getAvatarForUser(email: "${email}") {
            isSuccess,
            email,
            avatar
          }
        }
      `;
        // Make api call here
        const response3 = await apiClient.getAvatarForUser(query3);
        expect(response3.isSuccess).toBe(true);
        expect(response3.avatar).toBe('granny');
      });
      it('New User should NOT be able to retrieve avatar without registering first', async () => {
        // Get the new Avatar
        const query3 = `
        query {
          getAvatarForUser(email: "newUser123@domain.com") {
            isSuccess,
            email,
            avatar
          }
        }
      `;
        // Make api call here
        const response3 = await apiClient.getAvatarForUser(query3);
        expect(response3.isSuccess).toBe(false);
      });
    });
  });
});
