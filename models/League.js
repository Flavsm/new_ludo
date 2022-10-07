const mongoose = require("mongoose");
const { url } = require("../middleware/cloudinary");

const LeagueSchema = new mongoose.Schema({
    league: {
        type: String,
        required: false,
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
            default: '/imgs/user_feed.jpg'
        },
        profile: {
            type: String,
            required: true,
            default: '/imgs/user_profile.jpg'
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
    pinned: {
        type: Boolean,
        default: false,
    },
    allteams: []
})

module.exports = mongoose.model("League", LeagueSchema);