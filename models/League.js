const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema({
    league: {
        type: String,
        required: false,
        uppercase: true,
    },
    numberofteams: {
        type: String,
        required: false,
    },
    sport: {
        type: String,
        required: false,
        uppercase: true,
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
})

module.exports = mongoose.model("League", LeagueSchema);