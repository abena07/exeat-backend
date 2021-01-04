const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  lastLogin: {
    type: Date,
  },

  active: {},
});
module.exports = mongoose.model("Staff", staffSchema);
