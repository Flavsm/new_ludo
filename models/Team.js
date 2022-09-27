const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
    team: {
        type: String,
        required: false,
    },
    numberofplayers: {
        type: String,
        required: false,
    },
    sport: {
        type: String,
        required: false,
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
})

module.exports = mongoose.model("Team", TeamSchema);
