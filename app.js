var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

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
app.use(cookieParser());
//Implement CUSTOM AUTHENTICATION MIDDLEWARE vvv before we begin to route the REQUEST, or serve STATIC HTML PAGES. MIDDLEWARE runs in sequence parsing the request, adding to or TERMINATING the RESPONSE
function auth(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const err = new Error("You are not authenticated!");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    return next(err);
  }

  const auth = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const user = auth[0];
  const pass = auth[1];
  if (user === "admin" && pass === "password") {
    return next(); // authorized
  } else {
    const err = new Error("You are not authenticated!");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    return next(err);
  }
}

app.use(auth);
//end of BASIC AUTHENTICATION, this will serve the STATIC PAGES(index, aboutus).
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
//set up nucampsite routers
app.use("/campsites", campsiteRouter);
app.use("/partners", partnerRouter);
app.use("/promotions", promotionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
//*** */ console.warn("look at error handler function")??? NOT SHOWING ERROR IN CHROME, 401 FORBIDDEN  in CONSOLE;*****
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
