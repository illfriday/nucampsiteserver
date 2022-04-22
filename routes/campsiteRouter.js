//IMPORT Express from /node_modules
const express = require("express");
//require the 'Campsite' MONGOOSE MODEL
const Campsite = require("../models/campsite");
//set up an instance of EXPRESS ROUTER. Gives us an OBJECT named 'campsiteRouter' that we can use with EXPRESS ROUTING METHODS
//import AUTHENTICATE CUSTOM MIDDLEWARE from authenitcate.js
const authenticate = require("../authenticate");
//IMPORT 'cors' MODULE
const cors = require('./cors');

const campsiteRouter = express.Router();

campsiteRouter
  .route("/")
//****setup CORS OPTIONS to handle PREFLIGHT REQUEST, CALL corsOptionsDelegate() from cors.js*/
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  // .all((req, res, next) => {
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "text/plain");
  //   next();
  //   //pass control of application routing to next relevant ROUTING METHOD
  // })
  // Next ROUTING METHOD handling GET REQUESTS, and so on...
  .get(cors.cors, (req, res, next) => {
    //use .find() STATIC METHOD to query DB for all DOCS instantiated using the 'Campsites' MODEL, returning a PROMISE
    Campsite.find()
    .populate('comments.author')
      .then((campsites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsites);
      })
      // res.end("Will send all the campsites to you.");
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //create a new 'Campsite' DOCUMENT through the REQUEST BODY, returning a PROMISE
    Campsite.create(req.body)
      .then((campsite) => {
        console.log("Campsite created:", campsite);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      // res.end(
      //   `Will add the campsite: ${req.body.name} with description: ${req.body.description}`
      // );
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /campsites.");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    // res.end("Deleting all campsites.");
    Campsite.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

campsiteRouter
  .route("/:campsiteId")
  // .all((req, res, next) => {
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "text/plain");
  //   next();
  // })
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .populate('comments.author')
      .then((campsite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      .catch((err) => next(err));
    // res.end(`Will send details of the campsite: ${req.params.campsiteId}`);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on campsites/${req.params.campsiteId}`
    );
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Campsite.findByIdAndUpdate(
      req.params.campsiteId,
      { $set: req.body },
      { new: true }
    )
      .then((campsite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      .catch((err) => next(err));
    // res.write(`Updating the campsite: ${req.params.campsiteId}\n`);
    // res.end(
    //   `Will update the campsite: ${req.body.name} with the description: ${req.body.description}`
    // );
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
    // res.end(`Deleting the campsite: ${req.params.campsiteId}`);
  });

campsiteRouter
  .route("/:campsiteId/comments")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .populate('comments.author')
      .then((campsite) => {
        if (campsite) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(campsite.comments);
        } else {
          err = new Error(`Campsite ${req.params.campsiteId} not found.`);
          res.statusCode = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite) {
          req.body.author = req.user._id;
          campsite.comments.push(req.body);
          campsite
            .save()
            .then((campsite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(campsite);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Campsite ${req.params.campsiteId} not found.`);
          res.statusCode = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /campsites/${req.params.campsiteId}/comments`
    );
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, 
    (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite) {
          for (let i = campsite.comments.length - 1; i >= 0; i--) {
            campsite.comments.id(campsite.comments[i]._id).remove();
          }
          campsite
            .save()
            .then((campsite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(campsite);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Campsite ${req.params.campsiteId} not found.`);
          res.statusCode = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

campsiteRouter
  .route("/:campsiteId/comments/:commentId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .populate('comments.author')
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(campsite.comments.id(req.params.commentId));
        } else if (!campsite) {
          err = new Error(`Campsite ${req.params.campsiteId} not found.`);
          res.statusCode = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found.`);
          res.statusCode = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`
    );
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          if ((campsite.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
            if (req.body.rating) {
            campsite.comments.id(req.params.commentId).rating =
              req.body.rating;
          }
          if (req.body.text) {
            campsite.comments.id(req.params.commentId).text = req.body.text;
          }
          campsite
            .save()
            .then((campsite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(campsite);
            })
            .catch((err) => next(err));
          } else {
            const err = new Error('You are not the author of this comment');
            err.status = 403;
            return next(err);
          }
          
        } else if (!campsite) {
          err = new Error(`Campsite ${req.params.campsiteId} not found.`);
          res.statusCode = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found.`);
          res.statusCode = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          if ((campsite.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
            campsite.comments.id(req.params.commentId).remove();
          campsite
            .save()
            .then((campsite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(campsite);
            })
            .catch((err) => next(err));
          } else {
            const err = new Error('You are not the author of this comment');
            err.status = 403;
            return next(err);
          }
          
        } else if (!campsite) {
          err = new Error(`Campsite ${req.params.campsiteId} not found.`);
          res.statusCode = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found.`);
          res.statusCode = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });
//EXPORTS the 'campsiteRouter' as a NODE MODULE to be used in other files
module.exports = campsiteRouter;
/**ROUTES with the '/:campsiteId' ROUTE PARAMETER to be moved to '/routes/campsiteRouter */

// app.get("/campsites/:campsiteId", (req, res) => {
//   res.end(
//     `Will send details of the campsite: ${req.params.campsiteId} to you.`
//   );
// });

// app.post("/campsites/:campsiteId", (req, res) => {
//   res.statusCode = 403;
//   res.end(`POST operation not supported on campsites/${req.params.campsiteId}`);
// });

// app.put("/campsites/:campsiteId", (req, res) => {
//   res.write(`Updating the campsite: ${req.params.campsiteId}\n`);
//   res.end(
//     `Will update the campsite: ${req.body.name} with the description: ${req.body.description}`
//   );
// });

// app.delete("/campsites/:campsiteId", (req, res) => {
//   res.end(`Deleting campsite: ${req.params.campsiteId}`);
// });
