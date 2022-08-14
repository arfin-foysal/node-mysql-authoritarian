const passport=require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID:"419443856924-04hmt7kinto52h7e9j1m2fekkrp5b5k9.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      done(null, profile)
      console.log(profile);
      console.log(refreshToken);
      console.log(accessToken);
  }
));

passport.serializeUser((user,done) => {
    done(null,user)
})
passport.deserializeUser((user,done) => {
    done(null,user)
})