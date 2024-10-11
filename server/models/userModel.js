/* eslint-disable no-undef */
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  provider: {
    type: String,
  },
  googleId: { type: String, unique: true, sparse: true },
});

module.exports = mongoose.model("User", userSchema);
