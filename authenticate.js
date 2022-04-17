//import PASSPORT
const passport = require("passport");
//import PASSPORT-LOCAL & set it as the AUTHENTICATION STRATEGY to store unames/pwords locally on SERVER-SIDE
const LocalStrategy = require("passport-local").Strategy;
//import our User SCHEMA
const User = require("./models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

const config = require("./config.js");
//creates new INSTANCE of LocalStrategy, requires a verifyCallback FUNCTION(.authenticate() from PASSPORT-LOCAL)
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//set up SESSION based AUTHENTICATION using SERIALIZATION/DE-SERIALIZATION of User INSTANCE
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
  //returns USER, .secretKey IMPORTED from 'config.js', & CONFIGS to expire TOKEN
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.verifyAdmin = (req, res, next) => {
  if (!req.user.admin) {
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'application/json')
    // res.json(req.headers)
    err = new Error('You are not an admin')
    err.status = 403;
    
    return next(err);
  } else {
    return next();
  }
}

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('JWT payload:' ,jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate('jwt', {session: false});
// exports.verifyAdmin = passport.authenticate('jwt', {session: false});
