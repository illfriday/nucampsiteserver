//configure CORS MODULE
const cors = require('cors');
//set up WHITELIST for allowed ORIGINS
const whitelist = ['http://localhost:3000', 'https://localhost:3443'];

const corsOptionsDelegate = (req, cb) => {
  let corsOptions;
  console.log(req.header('Origin'));
  //check if ORIGIN appears in the WHITELIST and ACCEPT by sending back the CORS HEADER 'Access-Control-Allow-Origin'
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin : true };
  } else {
    corsOptions = { origin : false };
  }
  cb(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);