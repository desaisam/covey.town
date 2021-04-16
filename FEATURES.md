# New Features in Covey.Town

Hello there!
So in this release, we have added real-time persistence to the existing Covey.Town App using Postgres + GraphQL as the backend database stack. The main motivation behind introducing such a real-time persistence into the covey.town app was to separate out the data storage and handling, from the main businiss logic in the covey.town code.

With this implemented, it paves way for new exciting features to be added to the application including Signing-in (or registering) as a first time user, Logging-in as a returning user, selecting new Avatar before entering a room from a list of available avatars and saving this preference for all future logins into the applications. Some more details about each of the above features can be found below.

# Sign-up

As a first-time user visiting our app, he/she needs is able to sign up on the platform so that his/her profile and preferences are saved with the app.

- Users are able to easily locate and sign up using their email, name and password.
- Prompts to enter the email and set the password are clearly distinguishable and visible.
- Once registered successfully, the user is taken back to login page and is notified to login instead of signing up again.
- After successful sign up, users are able to see the details that are associated with their accounts on the home page.

# Login

As an already existing user who has previously registered on the platform, he/she need is able to log in on covey.town so that he/she is able to see their stored preferences every time they login to use the app.

- Users are be able to easily locate and log in using their email and password.
- If not already registered or invalid credentials, covey.town notifies the users with a proper message indicating that their credentials are wrong and are reminded to register first if they haven't done it yet.
- After successful login, users are able to see the details that are associated with their accounts.

# Avatar

An exciting new feature that has been added to Covey.town is that users can finally change the appearance of their characters. We have provided a total of 6 different avatars to choose from for the user such as `Barmaid, Warrioir, Granny, Cooldude, Monk and Scientist`. For using this functionality, the user needs to first sign-up (or register) on the platform first so that he can access this feature.

As an already existing user who has previously registered on the platform, he/she is able to choose a custom avatar according to their likes. This avatar is visible while using covey.town and the app saves this preference for future logins.

- Users is able to easily locate the functionality to choose an Avatar.
- The Avatar the user chose is persisted and associated with his entry in the database, so that it is already chosen the next time the user logs in.

## Steps that should be taken to exercise all the new added features:

1.  On the home screen, click on the `Register` button. Upon clicking on the `Register` button, you’ll be redirected to the Sign Up page. This page will have input boxes for entering the `Name, Email and Password`.
2.  Upon entering the credentials, click on the `Sign Up` button to create a new profile. After that, we’ll be redirected to the Sign In page, where we need to enter the newly created Email and the Password. Then we click on the `Sign In` button.
3.  Then you need to click on the Sign In button upon which you will be redirected to the Home page, where you can choose a new Avatar by clicking the `Choose Avatar` button on the top right corner.
4.  The `Choose Avatar` button hosts multiple avatars with their pictures and the user can click on any of the avatar to use it. The newly selected avatar will then be reflected in the top right corner of the screen as an image.

Note: After every successful or unsuccessful action of the user, we have provided a toast which will notify the user of what just happened.
