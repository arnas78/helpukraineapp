const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name_surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
