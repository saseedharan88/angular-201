    
const GoogleStrategy = require('passport-google-oauth')
.OAuth2Strategy;

module.exports = function (passport) {
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
passport.use(new GoogleStrategy({
    clientID: "533418441234-7vtu3rrpm0n4bll0u2d1q1tng2m3v2a6.apps.googleusercontent.com",
    clientSecret: "FsbDqHDdL5ftjhGCVjM59qHv",
    callbackURL: '/auth/google/callback'
}, (token, refreshToken, profile, done) => {
    return done(null, {
        profile: profile,
        token: token
    });
}));
};