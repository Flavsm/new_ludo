const mongoose = require("mongoose");
//const { url } = require("../middleware/cloudinary"); prob deleted it

const PlayerSchema = new mongoose.Schema({
  team: {
    type: String,
    required: false,
    uppercase: true,
  },
  image: {
    feed: {
      type: String,
      required: false,
    },
    profile: {
      type: String,
      required: false,
    },
    required: false
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  player: {
    type: String,
    required: true,
    uppercase: true,
  },
  position: {
    type: String,
    required: false,
    uppercase: true,
  },
  win: {
    type: String,
    required: false,
    default: 0,
  },
  loss: {
    type: String,
    required: false,
    default: 0,
  },
  notes: {
    type: String,
    required: false,
    uppercase: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  pinned: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Player", PlayerSchema);
