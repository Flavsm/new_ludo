const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const User = require('../models/User');
const Team = require('../models/Team');

module.exports = {
  /* getPlayers: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      const userPosts = await Post.find(req.user)
      const post = await Post.findById(req.params.id);
      const url = await req.originalUrl;
      console.log(userPosts)
      res.render("partial-feed.ejs", { posts: posts, user: req.user, post: post, userPosts: userPosts, url: url });
    } catch (err) {
      console.log(err);
    }
  }, */
  // getTeams: async (req, res) => {
  //   try {
  //     const posts = await Post.find().sort({ createdAt: "desc" }).lean();
  //     const teams = await Team.find().sort({ createdAt: "desc" }).lean();
  //     /* const userPosts = await Post.find(req.user) */
  //     const post = await Post.findById(req.params.id);
  //     const url = await req.originalUrl;
  //     /* console.log(userPosts) */
  //     res.render("partial-feed.ejs", { posts: posts, user: req.user, post: post, teams: teams, url: url });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  getLeagues: async (req, res) => {
    try {
      const players = await Player.find().sort({ createdAt: "desc" }).lean();
      /* const userPosts = await Post.find(req.user) */
      const player = await Player.findById(req.params.id);
      const url = await req.originalUrl;
      /* console.log(userPosts) */
      res.render("partial-feed.ejs", { posts: players, user: req.user, post: player, /* userPosts: userPosts, */ url: url });
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {

      // Find post by id
      let player = await Player.findById({ _id: req.params.id });

      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Player.deleteOne({ _id: req.params.id });

      // Delete post from DB array
      const deleteIdFromUser = await User.updateOne(
        { _id: req.user.id },
        {
          $pull: { entries: post.id }
        }
      )
      console.log(req.body)
      console.log("Deleted Post");
      res.redirect("/players"); //changed from profile to feed
    } catch (err) {
      res.redirect("/players"); //changed from profile to home
    }
  },
}

