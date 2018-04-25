/* waks:start=File Upload Server=start
1. Go to https://developers.facebook.com/apps, and click "Register Now" to become a Facebook developer
2. Name your app and give a contact email
3. Go to "Facebook Login" > "Web"
4. Enter the URL of your production website
5. Copy the Facebook SDK script tag into your client, and replace the App ID placeholder (it's on the page you copied the script tag from). Go to https://developers.facebook.com/docs/javascript/reference/ and take note of the API version that gets added to the URL- replace the version with that.
6. Go to https://developers.facebook.com/docs/facebook-login/web/login-button to generate a login button, and put it on your page
waks:example */
const express = require("express");
const router = express.Router();

// Dependencies
const passport = require("passport");
// Pull in the strategy from the auth provider you want to use
const {Strategy} = require("passport-facebook");

// Create an instance of passport that uses the strategy
// `verify` is a function that gives you the opportunity to
// examine the provided credentials and grant or restrict
// access to your app
passport.use(new Strategy({
    // ID and Secret come from Facebook
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    // Callback URL needs to be registered with them
    callbackURL: process.env.FACEBOOK_REDIRECT_URL,
    enableProof: true
}, verify));

function verify(accessToken, refreshToken, profile, next){
    // Verify their information, or create user
    next(null, profile);
}

router.use(passport.initialize());

router.get("/login", passport.authenticate("facebook", {
    session: false
}));

router.get("/logout", (request, response) => {
    request.logout();
    response.status(204).send();
});

// This is where Facebook will send the user
router.get("/redirect", passport.authenticate("facebook", {
    session: false
}), (request, response) => {
    response.send(generateAuthenticationPage(request.user));
});

// Add JWT decoding to requests
const passportJwt = require("passport-jwt");
passport.use(new passportJwt.Strategy({
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN_SECRET
}, (payload, done) => {
    const user = {
        id: payload.id,
        name: payload.name
    };
    return payload.sub
        ? done(null, user, payload)
        : done();
}));

router.get("/secure",
    passport.authenticate("jwt", {session: false}),
    (request, response) => {
        response.json({data: `Got a secure response from ${request.user.name}`});
    }
);

function generateAuthenticationPage(user){
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Authenticated</title>
                <script type="text/javascript">
                    window.opener.postMessage({
                        command: "setToken",
                        token: "${generateAccessToken(user)}"
                    }, "*");
//                    }, "https://webappkitchensink.com");
                    window.close();
                </script>
            </head>
            <body></body>
        </html>
    `;
}

const jwt = require("jsonwebtoken");
function generateAccessToken(user){
    return jwt.sign({
        userId: user.id,
        name: user.displayName
    }, process.env.TOKEN_SECRET, {
        subject: user.id,
        expiresIn: 60 * 60 * 1000
    });
}

module.exports = router;
/* waks:end */
