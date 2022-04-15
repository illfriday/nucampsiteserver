var createError = require("http-errors");
var express = require("express");
var path = require("path");
//import 'cookie-parser' MIDDLEWARE to parse COOKIES / process SIGNED COOKIES
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//import EXPRESS-SESSION MIDDLEWARE to store user/session data on SERVER-SIDE
const session = require("express-session");
// ES6 1st CLASS FUNCTIONS allow us to CALL the REQUIRE FUNCTION from 'session' as a 2nd PARAMETER??
const fileStore = require("session-file-store")(session);
const passport = require("passport");
const authenticate = require("./authenticate");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
//import nucamp ROUTERS
const campsiteRouter = require("./routes/campsiteRouter");
const partnerRouter = require("./routes/partnerRouter");
const promotionRouter = require("./routes/promotionRouter");

//require MONGOOSE
const mongoose = require("mongoose");
//url for MongoDB SERVER
const url = "mongodb://localhost:27017/nucampsite";
//set up connection to MongoDB SERVER...url^^^ & configs.vvv
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//handle PROMISE returned from .connect() METHOD. Handling the ERROR w/o .catch() METHOD bc we aren't chaining METHOD(just alt syntax here)
connect.then(
  () => console.log("Connected correctly to server.   "),
  (err) => console.log(err)
);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser("5454548-54545-87891215a@rT5&8"));
//use 'cookie-parser' MIDDLEWARE to process SIGNED COOKIES. passing a random KEY/SIGNATURE to encrypt the information

//set up 'express-session' MIDDLEWARE with a name, secret key, configs & use 'session-file-store' MIDDLEWARE to store the SESSION INFO in the SERVER'S storage
app.use(
  session({
    name: "session-id",
    secret: "5454548-54545-87891215a@rT5&8",
    saveUninitialized: false,
    resave: false,
    store: new fileStore(),
  })
);

//set-up PASSPORT SESSION-BASED AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());
//Implement CUSTOM AUTHENTICATION MIDDLEWARE vvv before we begin to route the REQUEST, or serve STATIC HTML PAGES. MIDDLEWARE runs in sequence parsing the request, adding to or TERMINATING the RESPONSE
function auth(req, res, next) {
  console.log(req.user);

  //.signedCookie PROPERTY of the REQUEST OBJECT(.req). if COOKIE is not properly SIGNED, returns VALUE of FALSE. The .user PROPERTY is added by us(CUSTOM)
  // if (!req.signedCookies.user) {
  if (!req.user) {
    // const authHeader = req.headers.authorization;
    // if (!authHeader) {
    const err = new Error("You are not authenticated!");
    // res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    return next(err);
    // }

    // const auth = Buffer.from(authHeader.split(" ")[1], "base64")
    //   .toString()
    //   .split(":");
    // const user = auth[0];
    // const pass = auth[1];
    // if (user === "admin" && pass === "password") {
    //   // res.cookie("user", "admin", { signed: true });
    //   //res.cookie() uses EXPRESS's .res OBJECT's API to create a SIGNED COOKIE OBJECT with the name we will use('user'): COOKIE : {'user':'admin', signed:true} tells EXPRESS to use the SECRET KEY from 'cookie-parser' MIDDLEWARE^^^^
    //   req.session.user = "admin";
    //   return next(); // authorized
    // } else {
    //   const err = new Error("You are not authenticated!");
    //   res.setHeader("WWW-Authenticate", "Basic");
    //   err.status = 401;
    //   return next(err);
    // }
  } else {
    return next();
    //***Update code to move on to next MIDDLEWARE if we have a SESSION for the USER^^^^^ */
    // if (req.session.user === "authenticated") {
    //   return next();
    // } else {
    //   const err = new Error("You are not authenticated.");
    //   err.status = 401; //FORBIDDEN
    //   return next(err);
    // }
  }
}
//we have moved up the /(index) & /usersRouter before the .app.use(auth) so UNAUTHENTICATED users can create an account & be redirected to index when logged out
app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(auth);
//end of BASIC AUTHENTICATION, this will serve the STATIC PAGES(./public/index, aboutus).
app.use(express.static(path.join(__dirname, "public")));

//set up nucampsite routers
app.use("/campsites", campsiteRouter);
app.use("/partners", partnerRouter);
app.use("/promotions", promotionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
