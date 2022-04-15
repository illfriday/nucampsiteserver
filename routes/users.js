const express = require("express");
//import our 'user' MONGOOSE SCHEMA
const User = require("../models/user");
const passport = require("passport");

const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/sign-up", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err) => {
      if (err) {
        //handles the event of a DB error
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        //authenticate with PASSPORT
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    }
  );
});
//*** re-wrote this COOKIES/SESSION-BASED auth function to use PASSPORT ^^^^^*/
// User.findOne({ username: req.body.username })
//   .then((user) => {
//     if (user) {
//       const err = new Error(`User ${req.body.username} already exists.`);
//       err.status = 403;
//       return next(err);
//     } else {
//       User.create({
//         username: req.body.username,
//         password: req.body.password,
//       })
//         .then((user) => {
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "application/json");
//           res.json({ status: "Registration successful", user: user });
//         })
//         .catch((err) => next(err));
//     }
//   })
//   .catch((err) => next(err));

//add the authenticate METHOD from PASSPORT
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, status: "You are successfully logged in!" });
});
//****re-write COOKIES/SESSION-BASED auth with PASSPORT-LOCAL, which will handle checking the username/password combo and handle any errors ^^^^^^^ */
//   if (!req.session.user) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       const err = new Error("You are not authenticated!");
//       res.setHeader("WWW-Authenticate", "Basic");
//       err.status = 401;
//       return next(err);
//     }

//     const auth = Buffer.from(authHeader.split(" ")[1], "base64")
//       .toString()
//       .split(":");
//     const username = auth[0];
//     const password = auth[1];

//     //Check the username and password that the USER/CLIENT is sending and check it against the DOCUMENTS in the 'Users' mongoDB COLLECTION. 1st, can we find a USER in the DB that matches the 'username' being sent to us as part of the CREDENTIALS in the REQUEST HEADERS? vvv   We are checking the 'username' field set up by our 'user'Schema bc it must be unique
//     User.findOne({ username: username })
//       .then((user) => {
//         if (!user) {
//           const err = new Error(`User ${username} does not exist.`);
//           err.status = 401;
//           return next(err);
//         } else if (user.password !== password) {
//           const err = new Error(`Password does not match ${username}.`);
//           err.status = 401;
//           return next(err);
//         } else if (user.username === username && user.password === password) {
//           req.session.user = "authenticated";
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "text/plain");
//           res.end("You are authenticated.");
//         }
//       })
//       .catch((err) => next(err));
//   } else {
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "text/plain");
//     res.end("You are already authenticated.");
//   }
// });

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    const err = new Error("You are not logged in.");
    err.status = 401;
    return next(err);
  }
});
module.exports = router;
