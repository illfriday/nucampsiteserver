const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  //'username' & 'password' FIELDS are now handled by passport-local-mongoose MONGOOSE PLUG-IN
  // username: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  // password: {
  //   type: String,
  //   required: true,
  // },
  admin: {
    type: Boolean,
    default: false,
  },
});
//add the PLUG-IN to our SCHEMA for use
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
