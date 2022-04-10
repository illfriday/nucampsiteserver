//define the MONGOOSE SCHEMA and the MODEL for all DOCUMENTS in our 'campsites' COLLECTION
const mongoose = require("mongoose");
//create a shorthand for 'mongoose.Schema
const Schema = mongoose.Schema;

//create a new MONGOOSE SCHEMA
const partnerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  //CONFIGS(optional)
  {
    timestamps: true,
  }
);

const Partner = mongoose.model("Partner", partnerSchema);
//export the MODEL
module.exports = Partner;
