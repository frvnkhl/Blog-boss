const { User } = require('../models/userModel');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const BCRYPT_SALT_ROUNDS = 12;

//passport strategies
passport.use('register', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    session: false
},
    (req, username, password, done) => {
        console.log(username);
        console.log(req.body.email);

        try {
            User.findOne({ $or: [{ 'username': username }, { 'email': req.body.email }] }).then(user => {
                if (user) {
                    console.log('username or email already taken');
                    return done(null, false, {
                        message: 'username or email already taken',
                    });
                }
                bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
                    User.create({ username: username, password: hashedPassword, email: req.body.email }).then(user => {
                        console.log('user created');
                        return done(null, {
                            message: 'user created',
                            user: user
                        });
                    });
                });
            });
        } catch (err) {
            return done(err);
        }
    }
));

//passport strategy using username and password
passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false
},
    (username, password, done) => {
        try {
            User.findOne({ username: username }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'Bad username' });
                }
                bcrypt.compare(password, user.password).then(res => {
                    if (!res) {
                        console.log('incorrect password');
                        return done(null, false, { message: 'Incorrect password' });
                    }
                    console.log('User found & authenticated');
                    return done(null, user);
                });
            });
        } catch (err) {
            done(err);
        }
    }
));

const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: process.env.JWT_SECRET
};

//Strategy using JWT
passport.use('jwt', new JWTstrategy(options, (jwt_payload, done) => {
    try {
        User.findOne({ _id: jwt_payload.id }).then(user => {
            if (user) {
                // console.log('user found in db in passport');
                done(null, user);
            } else {
                console.log('user not found in db');
                done(null, false);
            }
        });
    } catch (err) {
        done(err);
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

//passport strategy using Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/user/auth/google/blog-boss",
    proxy: true
},
    (_accessToken, _refreshToken, profile, cb) => {
        User.findOrCreate({
            googleId: profile.id, email: profile.emails[0].value, username: (profile.displayName + profile.id.substring(0, 5)).replace(/ /g, "_")
        }, (err, user) => {
            return cb(err, user);
        });
    }
));

//passport strategy using Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/user/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email'],
    proxy: true
},
    (_accessToken, _refreshToken, profile, cb) => {
        User.findOrCreate({
            facebookId: profile.id, email: profile.emails[0].value, username: (profile.displayName + profile.id.substring(0, 5)).replace(/ /g, "_")
        }, (err, user) => {
            return cb(err, user);
        });
    }
));

