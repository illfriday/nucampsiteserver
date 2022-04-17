const express = require("express");
//import our 'user' MONGOOSE SCHEMA
const User = require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");

const router = express.Router();

/* GET users listing. */
router.get("/", authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find()
      .then((users) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(users);
      })
      // res.end("Will send all the campsites to you.");
      .catch((err) => next(err));
});

router.post("/signup", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        //handles the event of a DB error
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        //authenticate with PASSPORT
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save(err => {
          if (err) {
            res.statusCode = 500;
             res.setHeader("Content-Type", "application/json");
            res.json({err:err});
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successful!" });
          });
        })
        
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
  const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
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

//     //Check the username and password that the USER/CLIENT is sending and check it against the DOCUMENTS in the 'Users' mongoDB COLLECTION. 1) find a USER in the DB that matches the 'username' being sent to us as part of the CREDENTIALS in the REQUEST HEADERS vvv  2)checking the 'username' field set up by our 'user'Schema bc it must be unique
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
