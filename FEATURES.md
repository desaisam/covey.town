# Covey.Town Design

The following is the high level architechture, of the covey.town, which highlights the new features that have been added.

![Covey.Twon Architechture](https://drive.google.com/file/d/1D4JqCSmCvx0U0ycHBG5kasPF_k9cUEuv/view?usp=sharing)

The interactions between these features have been explained below using various sequence diagrams.

## UML diagrams

### 1. Registering as a new User

```mermaid

sequenceDiagram

Home Page -->> Register Page: Click on "Register"

Register Page-->>Login Page: Click on "Sign Up"

Login Page-->>Home Page: Click on "Sign In"



Note right of Register Page: Register page has <br/> input boxes where <br/> the user can enter <br/> their details.

Note right of Login Page: Login page has <br/> input boxes where <br/> the user can enter <br/> their email and password.

Note right of Home Page: Now the user will <br/> be logged in and <br/> is ready to join a room. <br/> The user can now <br/> also choose a new avatar <br/> from the drop down <br/> at the top right



```

### 2. Logging-in as an existing User

```mermaid

sequenceDiagram

Home Page -->> Login Page: Click on "Log In"

Login Page-->>Home Page: Click on "Sign In"



Note right of Login Page: Login page has <br/> input boxes where <br/> the user can enter <br/> their email and password.

Note right of Home Page: Now the user will <br/> be logged in and <br/> is ready to join a room. <br/> The user can now <br/> also choose a new avatar <br/> from the drop down <br/> at the top right



```

### Choosing an Avatar as a logged-in User

```mermaid

sequenceDiagram

Home Page -->> Login Page: Click on "Login"

Login Page-->>Home Page: Click on "Sign In"

Home Page-->>Home Page: Click on "Choose Avatar"

Home Page-->>Room Page: Click on "Join Room" or "Create a new Room"



Note right of Login Page: Login page has <br/> input boxes where <br/> the user can enter <br/> their email and password.

Note right of Home Page: Now the user will <br/> be logged in and <br/> is ready to join a room.

Note right of Room Page: Now the user will <br/> be logged and is <br/> inside a room.

```

Overall, this is how the whole authentication process will look like:

```mermaid

graph LR

A(Home) -- If not registered --> B(Register)

B --> C(Login)

C --> D(Home)

A -- If already registered --> C

D --> E((Room))

```

## Changes made in the codebase:

The following changes have been made in the `components` directory:

1. **Log-In** Related: `SignInForm.tsx [Route: /signin]` inside the `pages` directory.

2. **Sign-Up** (Registration) Related: `SignUpForm.tsx [Route: /signup]` inside the `pages` directory.

3. The state of whether a particular users is signed in has been maintained inside the `useAppState` so that it is accessible on all the pages.

4. Added new interfaces: `UserLoginRequest`, `UserRegistrationRequest`, `SetAvatarRequest`, `UserLoginResponse`, `GetAvatarRequest`, `GetAvatarResponse`, `UserRegistrationResponse` and new service methods in `TownServiceClient.ts`

5. Added new files: `AvatarModal.tsx` and `ChangeAvatarMenu.tsx` and `navbar.tsx` in the `navbar` directory.
6. **Avatar** Related:
