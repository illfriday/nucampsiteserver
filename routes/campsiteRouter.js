//IMPORT Express from /node_modules
const express = require("express");
//set up an instance of EXPRESS ROUTER. Gives us an OBJECT named 'campsiteRouter' that we can use with EXPRESS ROUTING METHODS
const campsiteRouter = express.Router();

campsiteRouter
  .route("/")

  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
    //pass control of application routing to next relevant ROUTING METHOD
  })
  //Next ROUTING METHOD handling GET REQUESTS, and so on...
  .get((req, res) => {
    res.end("Will send all the campsites to you.");
  })
  .post((req, res) => {
    res.end(
      `Will add the campsite: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /campsites.");
  })
  .delete((req, res) => {
    res.end("Deleting all campsites.");
  });

campsiteRouter
  .route("/:campsiteId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end(`Will send details of the campsite: ${req.params.campsiteId}`);
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on campsites/${req.params.campsiteId}`
    );
  })
  .put((req, res) => {
    res.write(`Updating the campsite: ${req.params.campsiteId}\n`);
    res.end(
      `Will update the campsite: ${req.body.name} with the description: ${req.body.description}`
    );
  })
  .delete((req, res) => {
    res.end(`Deleting the campsite: ${req.params.campsiteId}`);
  });
//**ROUTES with the '/:campsiteId' ROUTE PARAMETER to be moved to '/routes/campsiteRouter */

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

//EXPORTS the 'campsiteRouter' as a NODE MODULE to be used in other files
module.exports = campsiteRouter;
