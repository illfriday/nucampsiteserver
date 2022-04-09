//define the MONGOOSE SCHEMA and the MODEL for all DOCUMENTS in our 'campsites' COLLECTION
const mongoose = require("mongoose");
//create a shorthand for 'mongoose.Schema
const Schema = mongoose.Schema;
//require MONGOOSE-CURRENCY & load so it's available to MONGOOSE
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;
//Create a new SCHEMA for 'comments' SUB-DOCUMENTS
const commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//create a new MONGOOSE SCHEMA
const campsiteSchema = new Schema(
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
    elevation: {
      type: Number,
      required: true,
    },
    cost: {
      type: Currency,
      required: true,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    //cause EVERY 'Campsite' DOCUMENTS to contain the multiple instances of the 'commentSchema' stored in an ARRAY. We can now have more than one comment
    comments: [commentSchema],
  },
  //CONFIGS(optional)
  {
    timestamps: true,
  }
);

//create a MODEL from 'campsiteSCHEMA. Use singular, capitalized version of the collection name for both the variable and MODEL name
const Campsite = mongoose.model("Campsite", campsiteSchema);
//export the MODEL
module.exports = Campsite;
