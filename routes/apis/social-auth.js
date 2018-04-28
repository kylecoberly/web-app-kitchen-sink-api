/* waks:start=Configuring a Facebook auth server=start
First, you need to register your application with Facebook.

1. Go to https://developers.facebook.com/apps, and click "Register Now" to become a Facebook developer
2. Name your app and give a contact email
3. Go to "Facebook Login" > "Settings"
4. Make sure "Client OAuth Login," "Web OAuth Login," "Enforce HTTPS," and "Use Strict Mode for Redirect URIs" are enabled
5. Add the full URL for your `/redirect` route (eg. "https://web-app-kitchen-sink-api.herokuapp.com/apis/social-auth/redirect")
6. Go to "Settings" > "Basic", and save your App ID and App Secret in your environment variables. Optionally, update the app icon, URL, TOS, and privacy policy.
7. Go to "Settings" > "Advanced", and activate "Require App Secret"

There are two major things to configure on the server:

1. The Facebook strategy, which will get a user's Facebook credentials so we can encode them into a JWT
2. The JWT strategy, which will decode the JWT they send and make sure they're allowed to access the data they're requesting.
waks:example */
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Create a configured instance of the Facebook auth strategy
const FacebookStrategy = require("passport-facebook").Strategy;
const facebookStrategy = new FacebookStrategy({
    // ID and Secret come from Facebook
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    // Callback URL needs to be registered with Facebook
    callbackURL: process.env.FACEBOOK_REDIRECT_URL,
    enableProof: true // This helps prevent MITM attacks
}, verifyLogin);
// This function gives you access to a user's profile, enabling
// you to look up a user in your database, add any additional details
// to the `request.user` object, add them to your database if they
// don't exist, or reject them for not being registered
function verifyLogin(accessToken, refreshToken, profile, next){
    // `profile` has all of their Facebook details
    next(null, profile);
}
// Uses the configured strategy
passport.use(facebookStrategy);

// This tells passport how to decode the JWT.
const passportJwt = require("passport-jwt");
const JWTStrategy = passportJwt.Strategy;
const jwtStrategy = new JWTStrategy({
    // It says that the JWT will come in via the `Authorization`
    // header using the bearer strategy, meaning that the header
    // will look something like this: `Authorization: Bearer xxx.yyy.zzz`.
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    // Used to encrypt the JWT
    secretOrKey: process.env.TOKEN_SECRET
}, verifyAccess);
// This function takes the decoded JWT and gives us an opportunity
// to verify that the user is allowed to access what they're trying
// to access. You may choose to look up any user details in a database
// that weren't already encoded in the JWT and add them to the
// `request.user` object here.
function verifyAccess(payload, next){
    // `payload` is the decoded JWT
    const user = {
        id: payload.id,
        name: payload.name
    };
    return payload.sub
        ? next(null, user, payload)
        : next();
}
// Uses the configured strategy
passport.use(jwtStrategy);

// Tell the server that passport is configured and ready to go
router.use(passport.initialize());
/* waks:end */

/* waks:start=Logging in=start
"Logging in" to a stateless service like this just means generating a token and sending it to the client to send on future API calls. `/login` will send the user to Facebook to log in, then it will redirect them to our `/redirect` endpoint with their Facebook data. `/redirect` generates another web page that encodes that data into a JWT to send back to the original app that called `/login`.
waks:example */
// Hitting this endpoint checks whether the user is logged into Facebook,
// prompting them to log in if they are not
router.get("/login", passport.authenticate("facebook", {session: false}));

// After the user is logged in, Facebook sends them to this endpoint
// (which you need to register with them), which generates a page
// for the client to open.
router.get("/redirect", passport.authenticate("facebook", {
    session: false
}), (request, response) => {
    // Generate a page with the user object, and send it to the
    // browser to open
    response.send(generateAuthenticationPage(request.user));
});

// This creates a web page that we will send to the original web app
// for it to open. We'll tell the newly opened web page to
// message a JWT we create containing the user's credentials
// to the page that opened it (our web app) and then immediately close
function generateAuthenticationPage(user){
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Authenticated</title>
                <script type="text/javascript">
                    // "Send a message the page that opened me"
                    window.opener.postMessage({
                        // Helps us distinguish this type of message
                        // from any others that might be sent
                        command: "setToken",
                        // Generate a token to send based on the user
                        token: "${generateToken(user)}"
                        // Narrow the scope of the request so that
                        // only our app can get the token
                    }, "https://webappkitchensink.com");
                    // Close the window once the token is sent
                    window.close();
                </script>
            </head>
            <body></body>
        </html>
    `;
}

// Given a user, we generate a JWT by encrypting the user's credentials
// with a TOKEN_SECRET that we make up
const jwt = require("jsonwebtoken");
function generateToken(user){
    return jwt.sign({
        userId: user.id,
        name: user.displayName
    }, process.env.TOKEN_SECRET, {
        subject: user.id,
        expiresIn: 60 * 60 * 1000
    });
}
/* waks:end */

/* waks:start=Protecting an API endpoint=start
If the user doesn't send a valid JWT to this endpoint, it redirects to the login. Otherwise, it sends us some top-secret information.
waks:example */
router.get("/secure",
    passport.authenticate("jwt", {
        session: false,
        failureRedirect: "/apis/socia-auth/login"
    }),
    (request, response) => {
        response.json({data: `Got a secure response from ${request.user.name}`});
    }
);
/* waks:end */

module.exports = router;
