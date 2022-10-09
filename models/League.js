const mongoose = require("mongoose");
const { url } = require("../middleware/cloudinary");

const LeagueSchema = new mongoose.Schema({
    league: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
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
    image: {
        feed: {
            type: String,
            required: true,
            default: '/imgs/league_feed.png'
        },
        profile: {
            type: String,
            required: true,
            default: '/imgs/league_profile.png'
        },
    },
    cloudinaryId: {
        type: String,
        require: false,
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
    allteams: []
})

module.exports = mongoose.model("League", LeagueSchema);