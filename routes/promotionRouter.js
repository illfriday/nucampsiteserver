//IMPORT Express from /node_modules
const express = require("express");
//set up an instance of EXPRESS ROUTER. Gives us an OBJECT named 'promotionRouter' that we can use with EXPRESS ROUTING METHODS
const promotionRouter = express.Router();

promotionRouter
  .route("/")

  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
    //pass control of application routing to next relevant ROUTING METHOD
  })
  //Next ROUTING METHOD handling GET REQUESTS, and so on...
  .get((req, res) => {
    res.end("Will send all the promotions to you.");
  })
  .post((req, res) => {
    res.end(
      `Will add the promotion: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions.");
  })
  .delete((req, res) => {
    res.end("Deleting all promotions.");
  });

promotionRouter
  .route("/:promotionId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end(`Will send details of the promotion: ${req.params.promotionId}`);
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on promotions/${req.params.promotionId}`
    );
  })
  .put((req, res) => {
    res.write(`Updating the promotion: ${req.params.promotionId}\n`);
    res.end(
      `Will update the promotion: ${req.body.name} with the description: ${req.body.description}`
    );
  })
  .delete((req, res) => {
    res.end(`Deleting the promotion: ${req.params.promotionId}`);
  });

//EXPORTS the 'promotionRouter' as a NODE MODULE to be used in other files
module.exports = promotionRouter;
