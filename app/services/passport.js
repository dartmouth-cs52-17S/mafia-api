import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import dotenv from 'dotenv';
import User from '../models/user_model';

dotenv.config({ silent: true });

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:9090/auth/facebook/callback',
},
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    User.findOne({ facebookId: profile.id }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
        });
        user.save((err) => {
          if (err) console.log(err);
          return done(err, user);
        });
      }
      // return done(err, user);
    });
  },
));

export const requireAuth = passport.authenticate('facebook', { session: false });
