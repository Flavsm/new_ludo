const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require('../models/User');
const Team = require('../models/Team');

module.exports = {
    getTeams: async (req, res) => {
        try {
            const posts = await Post.find().sort({ createdAt: "desc" }).lean();
            const teams = await Team.find().sort({ createdAt: "desc" }).lean();
            /* const userPosts = await Post.find(req.user) */
            const post = await Post.findById(req.params.id);
            const url = await req.originalUrl;
            /* console.log(userPosts) */
            res.render("partial-feed.ejs", { posts: posts, user: req.user, post: post, teams: teams, url: url });
        } catch (err) {
            console.log(err);
        }
    },
    getTeam: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            const team = await Team.findById(req.params.id);
            const url = await req.originalUrl;
            /* console.log(post) */
            res.render("post-team.ejs", { post: post, user: req.user, team: team, url: url }); //changes req.user to req.email
        } catch (err) {
            console.log(err);
        }
    },
    editTeam: async (req, res) => {
        try {
            await Team.findOneAndUpdate(
                { _id: req.params.id },
                [{
                    "$set": {
                        'team': req.body.team,
                        "sport": req.body.sport,
                        'numberofplayers': req.body.numberofplayers,
                        'win': req.body.win,
                        'loss': req.body.loss,
                        'notes': req.body.notes
                    }
                }]
            );

            res.redirect(`/teams/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    pinTeam: async (req, res) => {
        try {
            await Team.findOneAndUpdate(
                { _id: req.params.id },
                [{
                    "$set": { "pinned": { "$eq": [false, "$pinned"] } }
                }]
            );

            console.log("Toggle pinned");
            res.redirect(`/teams/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    deleteTeam: async (req, res) => {
        try {

            // Find post by id
            let team = await Team.findById({ _id: req.params.id });

            // Delete image from cloudinary
            //   await cloudinary.uploader.destroy(post.cloudinaryId);
            // Delete post from db
            await Team.deleteOne({ _id: req.params.id });

            // Delete post from DB array
            const deleteIdFromUser = await User.updateOne(
                { _id: req.user.id },
                {
                    $pull: { teamEntries: post.id }
                }
            )

            console.log("Deleted Post");
            res.redirect("/teams");
        } catch (err) {
            res.redirect("/teams");
        }
    },
}