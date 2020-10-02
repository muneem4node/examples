This is the sample application build using muneem web framework. It allows user to authenticate the application through google sign-in. You can use other auth provider too.

The purpose of this application is to demonstrate how **authorization code flow** can be implemented using Muneem web framework.

You will learn

* Basic usse of Muneem framework
* Using [muneem-q])() plugin to parse query strings
* User login/registration with external auth service provider like Google

Prerequisite: Register your app on on Google (auth service provider) console and use client id and pass given by your auth service provider to run this application.

## Tutorial

### Login/Registration

Authorization code flow is used to register/login a user in your app who are already registered with other auth service providers like: facebook, google, linkedin etc. You can also create your own auth service provider.

#### Flow

We have 4 entities here;

1. User
2. Client : frontend application. It can be a web application or mobile application.
3. Server: Or application which is registered with Auth service provider. Auth service provider provides an unique CLIENT_ID to identify it later. It also provides CLIENT_SECRET that we'll use and learn later in the code.
4. Auth service provider: A user must have registered to this auth service provider. Eg Google

Suppose that Google is our auth service provider, name of the application is 'My Notes', 

*Client side*: Authentication & Authorization

1. Client sends the user to a authorization URL provded by Google with previously issued client_id. Always include *state* parameter to be protected from [CSRF](https://security.stackexchange.com/questions/20187/oauth2-cross-site-request-forgery-and-state-parameter) attack.
2. User logs in into Google. ( In most of the cases, user is already logged in. )
3. User authenticates 'My Notes' to access basic profile detail and email id.
4. Google sends auth code to client
5. Client sends auth code to the MyNotes' server.

*Server side*

6.  Server  exchanges the auth code with access token with Google. Google returns id_token, access_token, and refresh_token.
7. Servere parses the id token to get user detail or makes another call to get userinfo using access token.
8. Server checks DB against the user detail. if it is not present then **register** the user detail, otherwise **login**.

