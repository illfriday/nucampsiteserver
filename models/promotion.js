//define the MONGOOSE SCHEMA and the MODEL for all DOCUMENTS in our 'campsites' COLLECTION
const mongoose = require("mongoose");
//create a shorthand for 'mongoose.Schema
const Schema = mongoose.Schema;
//require MONGOOSE-CURRENCY & load so it's available to MONGOOSE
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;
//create a new MONGOOSE SCHEMA
const promotionSchema = new Schema(
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
    cost: {
      type: Currency,
      require: true,
      min: 0,
    },
  },
  //CONFIGS(optional)
  {
    timestamps: true,
  }
);

const Promotion = mongoose.model("Promotion", promotionSchema);
//export the MODEL
module.exports = Promotion;
