const mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("Image", imageSchema);
