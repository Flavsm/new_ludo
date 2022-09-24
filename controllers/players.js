const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require('../models/User');


module.exports = {
    getPlayers: async (req, res) => {
        try {
            const posts = await Post.find().sort({ createdAt: "desc" }).lean();
            /* const userPosts = await Post.find(req.user) */
            const post = await Post.findById(req.params.id);
            const url = await req.originalUrl;
            console.log(posts)
            res.render("partial-feed.ejs", { posts: posts, user: req.user, post: post, /* userPosts: userPosts, */ url: url });
        } catch (err) {
            console.log(err);
        }
    },
    createPost: async (req, res) => {
        try {
            // Upload image to cloudinary

            /* const result = await cloudinary.uploader.upload(req.file.path); */


            const pattern = await cloudinary.uploader
                .upload(req.file.path,
                    {
                        eager: [
                            { width: 400, height: 300, crop: "pad" },
                            { width: 220, height: 220, crop: "pad" },]
                    })

            /* let img = cloudinary.image("LUDO/prof_dhezb9.jpg", {height: 300, width: 400, crop: "pad"}) */
            /* let img_default = "https://res.cloudinary.com/dprkasf7b/image/upload/c_pad,h_300,w_400/v1663434846/LUDO/prof_dhezb9.jpg" */

            let newPost = await Post.create({
                team: req.body.team,
                player: req.body.player,
                position: req.body.position,
                win: req.body.win,
                loss: req.body.loss,
                notes: req.body.notes,
                user: req.user.id,
                image: {
                    feed: pattern.eager[0].secure_url,
                    profile: pattern.eager[1].secure_url
                },
                cloudinaryId: pattern.public_id
            });


            const addIdToUser = await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $push: { entries: newPost.id },
                }
            )

            console.log("Post has been added!");
            res.redirect("/players"); //changed from profile to home

        } catch (err) {
            console.log(err);
        }
    },
    editPlayer: async (req, res) => {
        try {
            await Post.findOneAndUpdate(
                { _id: req.params.id },
                [{
                    "$set": { "team": req.body.team }
                }]
            );
            const posts = await Post.find().sort({ createdAt: "desc" }).lean();
            /* const userPosts = await Post.find(req.user) */
            const post = await Post.findById(req.params.id);
            const url = await req.originalUrl;

            console.log("Edited player");
            // res.redirect("/players");
            res.render("partial-feed.ejs", { posts: posts, user: req.user, post: post, /* userPosts: userPosts, */ url: url });
        } catch (err) {
            console.log(err);
        }
    },
    deletePost: async (req, res) => {
        try {

            // Find post by id
            let post = await Post.findById({ _id: req.params.id });

            // Delete image from cloudinary
            await cloudinary.uploader.destroy(post.cloudinaryId);
            // Delete post from db
            await Post.deleteOne({ _id: req.params.id });

            // Delete post from DB array
            const deleteIdFromUser = await User.updateOne(
                { _id: req.user.id },
                {
                    $pull: { entries: post.id }
                }
            )
            console.log(req.body)
            console.log("Deleted Player");
            res.redirect("/players"); //changed from profile to feed
        } catch (err) {
            res.redirect("/players"); //changed from profile to home
        }
    },
}



