const mongoose = require("mongoose");
const { Schema, Types, Model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
