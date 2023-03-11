const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user_type: {
    type: String,
    required: true,
  },
  name_surname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  post_type: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const Post = mongoose.model("post", postSchema);
module.exports = Post;
