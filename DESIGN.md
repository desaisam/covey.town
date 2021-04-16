# Covey.Town Design

In this release, we have added real-time persistence to the existing Covey.Town App using Postgres + GraphQL as the backend database stack. Given below is the new high level architecture of the covey.town, which highlights the new features that have been added and how these components interact with each other.

![Covey.Town Architecture](docs/covey-town-architecture.jpeg)

The interactions between these features have been explained below using various sequence diagrams.

## UML diagrams

### 1. Registering as a new User

The diagram below shows the detailed steps in sequential order as to how a new user would use and navigate through our new feature for registering to covey.town.

![Sign-up](docs/UML-register.png)

### 2. Logging-in as an existing User

The diagram below shows the detailed steps in sequential order as to how an existing user (registered user) would use and navigate through our new feature for logging-in to covey.town using their credentials.

![Log-in](docs/UML-signin.png)

### Choosing an Avatar as a logged-in User

The diagram below shows the detailed steps in sequential order as to how an existing user who has already registered would use and navigate through our new feature for choosing a new avatar to join a town and using it for all subsequent logins.

![Avatar](docs/UML-avatar.png)

Finally, this flowchart shows the whole authentication process:

![Covey.Town Architecture](docs/UML-authentication.png)

## Changes made in the codebase:

The following changes have been made in the `components` directory from the original covey.town codebase:

1. `App.tsx` was modified to add Routes. The app routes to different pages when the user performs Sign In and Sign Up opeations.

2. **Register**: `SignUpForm.tsx [route: /signup]` inside the `pages` directory. This component is rendered when the user clicks 'Sign Up' button. This component has form fields and buttons to complete User registeration.

3. **Login**: `SignInForm.tsx [route: /signin]` inside the `pages` directory. This component is rendered as soon as the user clicks the button 'Sign In' or when the user registers. The state of whether a particular users is signed in has been maintained inside the `useAppState` so that it is accessible on all the pages.

4. **Change Avatar**: `WorldMap.tsx` is altered to read the state `avatar` from the global state `useAppState`. Existing sprite avatar (Misa) was hardcoded in WorldMap.tsx. This is changed to dynamically read the avatar from the player (using database) and accordingly changed the existing animations like walk-left, walk-right etc. The Phaser atlas is now loaded with new sprite_new.json that has the information of all the new Sprite avatars. To accomodate this change, the `Player` class was changed to add a new field `avatar`. Added new files: `AvatarModal.tsx` and `ChangeAvatarMenu.tsx` and `navbar.tsx` in the `navbar` directory.

5. **GraphQL and PostgreSQL**: `/services/roomservice/schemas` consists of all code changes that allows frontend client to call GraphQL API to get/store data. GraphQL `query/mutation resolver` in-turn enagages with PostgreSQL database by performing required operations. PostgreSQL `pool/client` is created in `/postgres/db.ts`, GraphQL resolvers are in `index.ts`, and all required response types (used by graphql resolvers) are in `/typedefs`.
