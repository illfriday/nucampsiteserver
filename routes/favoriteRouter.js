const express = require("express");
const Favorite = require("../models/favorite");
//set up an instance of EXPRESS ROUTER. Gives us an OBJECT named 'partnerRouter' that we can use with EXPRESS ROUTING METHODS
const authenticate = require("../authenticate");
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({user: req.user._id})
      .populate("user")
      .populate("campsites")
      .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
      .then((favorite) => {
        console.log(favorite);
        if (favorite) {
          console.log(req.body);
          req.body.forEach(fave => {
            if (!favorite.campsites.includes(fave._id)) {
               favorite.campsites.push(fave._id);
            }
          })
          favorite.save()
          .then(favorite => {
            res.statusCode = 200;
            res.setHeader("Content-type", "application/json");
            res.json(favorite)
          })
          .catch(err => next(err)) 
        } else {
          Favorite.create({user: req.user._id})
          .then(favorite => {
            req.body.forEach(fave => {
            if (!favorite.campsites.includes(fave._id)) {
               favorite.campsites.push(fave._id);
            }
          })
          favorite.save()
          .then(favorite => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          })
          .catch(err => next(err))
        })

      .catch((err) => next(err));
      }
    })
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites.");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        } else {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/plain");
          res.end("You do not have any favorites to delete.");
        }
      })
      .catch((err) => next(err));
  });

  favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on favorites/${req.params.campsiteId}`);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then((favorite) => {
      if (favorite) {
            if (!favorite.campsites.includes(req.params.campsiteId)) {
            favorite.campsites.push(req.params.campsiteId);
            favorite.save()
            .then(favorite => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite)
            })
            .catch((err) => next(err))
            } else {
            
              res.statusCode = 403;
              res.setHeader = 'Content-Type', 'text/plain';
              res.end('That campsite is already in the list of favorites!')
              
            }
           } else {
          Favorite.create({user: req.user._id, campsites: [req.params.campsiteId]})
          .then((favorite) => {
              res.statusCode = 200;
              res.setHeader = "Content-Type", "application/json";
              res.json(favorite)
          })
          .catch(err => next(err))
        }
      })
      .catch((err) => next(err))
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on favorites/${req.params.campsiteId}`);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id})
      .then((favorite) => {
        if (favorite.campsites.includes(req.params.campsiteId)) {
          const index = favorite.campsites.indexOf(req.params.campsiteId);
          if (index >= 0) {
            favorite.campsites.splice(index, 1)
          }
          favorite.save()
          .then(favorite => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          })
          .catch(err => next(err))
        } else {
          
            res.statusCode = 410;
            res.setHeader("Content-type", "text/plain");
            res.end("That campsite isn't in your favorites collection.")
          
          
        }
      })
      .catch(err => next(err))
  })
  

module.exports = favoriteRouter;
