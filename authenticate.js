//import PASSPORT
const passport = require("passport");
//import PASSPORT-LOCAL & set it as the AUTHENTICATION STRATEGY to store unames/pwords locally on SERVER-SIDE
const LocalStrategy = require("passport-local").Strategy;
//import our User SCHEMA
const User = require("./models/user");
//creates new INSTANCE of LocalStrategy, requires a verifyCallback FUNCTION(.authenticate() from PASSPORT-LOCAL)
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//set up SESSION based AUTHENTICATION using SERIALIZATION/DE-SERIALIZATION of User INSTANCE
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
