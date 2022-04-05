//IMPORT Express from /node_modules
const express = require("express");
//set up an instance of EXPRESS ROUTER. Gives us an OBJECT named 'partnerRouter' that we can use with EXPRESS ROUTING METHODS
const partnerRouter = express.Router();

partnerRouter
  .route("/")

  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
    //pass control of application routing to next relevant ROUTING METHOD
  })
  //Next ROUTING METHOD handling GET REQUESTS, and so on...
  .get((req, res) => {
    res.end("Will send all the partners to you.");
  })
  .post((req, res) => {
    res.end(
      `Will add the partner: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /partners.");
  })
  .delete((req, res) => {
    res.end("Deleting all partners.");
  });

partnerRouter
  .route("/:partnerId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end(`Will send details of the partner: ${req.params.partnerId}`);
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on partners/${req.params.partnerId}`);
  })
  .put((req, res) => {
    res.write(`Updating the partner: ${req.params.partnerId}\n`);
    res.end(
      `Will update the partner: ${req.body.name} with the description: ${req.body.description}`
    );
  })
  .delete((req, res) => {
    res.end(`Deleting the partner: ${req.params.partnerId}`);
  });

//EXPORTS the 'partnerRouter' as a NODE MODULE to be used in other files
module.exports = partnerRouter;
