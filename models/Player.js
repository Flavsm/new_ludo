const mongoose = require("mongoose");
//const { url } = require("../middleware/cloudinary"); prob deleted it

const PlayerSchema = new mongoose.Schema({
  player: {
    type: String,
    required: true,
    uppercase: true,
  },
  team: {
    type: String,
    required: false,
    uppercase: true,
  },
  sport: {
    type: String,
    required: false,
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
  },
  table: [
    {
      row: {
        cell1: {
          type: String,
          required: true,
          uppercase: true
        },
        cell2: {
          type: String,
          required: true,
          uppercase: true
        },
        cell3: {
          type: String,
          required: true
        },
        cell4: {
          type: String,
          required: true
        },
        cell5: {
          type: String,
          required: true
        },
        cell6: {
          type: String,
          required: true
        },
        cell7: {
          type: String,
          required: true
        },
        cell8: {
          type: String,
          required: true
        },
        cell9: {
          type: String,
          required: true
        }
      }
    }
  ]
});

module.exports = mongoose.model("Player", PlayerSchema);
