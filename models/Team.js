const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
    team: {
        type: String,
        required: false,
        uppercase: true,
    },
    numberofplayers: {
        type: String,
        required: false,
    },
    sport: {
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
})

module.exports = mongoose.model("Team", TeamSchema);
