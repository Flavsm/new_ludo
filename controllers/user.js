const { ObjectId } = require("mongodb");
const Player = require("../models/Player");
const User = require('../models/User');
const League = require('../models/League')

module.exports = {
  getProfile: async (req, res) => {
    try {
      // const posts = await Post.find({ user: req.user.id });
      const users = await User.findById(req.params.id)
      const url = await req.originalUrl;
      res.render("profile.ejs", { /* players: players,  */user: req.user, users: users, url: url, body: req.body, obj: req.body.leagues });
      /* console.log(users) */
    } catch (err) {
      console.log(err);
    }
  },
  updateLeague: async (req, res) => {
    try {
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $push: { leagues: { 'league': req.body.league.toUpperCase() } }
        },
        {
          new: true
        }
      )
      const url = await req.originalUrl;

      /* console.log(req.body) */

      console.log("CHANGED USER");
      // res.render("profile.ejs", { /* posts: posts,  */user: req.user, url: url, body: req.body, obj: req.body.leagues });
      res.redirect(`/profile/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  updateTeam: async (req, res) => {
    try {
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $push: { teams: { 'team': req.body.team.toUpperCase() } }
          // $push: { teams: { 'team': req.body.team.toLowerCase(), 'sport': req.body.sport.toLowerCase() } }
        },
        {
          new: true
        }
      )
      const url = await req.originalUrl;

      /* console.log(req.body) */

      console.log("CHANGED USER");
      res.redirect(`/profile/${req.params.id}`);
      // res.render("profile.ejs", { /* posts: posts,  */user: req.user, url: url, body: req.body, obj: req.body.leagues });
    } catch (err) {
      console.log(err);
    }
  },
  deleteLeague: async (req, res) => {
    try {


      // Find user by id
      const user = await User.findById(req.params.id)
      //Delete post from DB array
      const deleteLeagueFromUser = await User.updateOne(
        { _id: req.user.id },
        {
          $pull: { 'leagues': user.leagues.filter(el => el.league === req.body.league)[0] }
        }
      )

      console.log("Deleted league");
      res.redirect(`/profile/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteTeam: async (req, res) => {
    try {

      // Find user by id
      const user = await User.findById(req.params.id)
      //Delete post from DB array
      const deleteTeamFromUser = await User.updateOne(
        { _id: req.user.id },
        {
          $pull: { 'teams': user.teams.filter(el => el.team === req.body.team)[0] }
        }
      )

      console.log("Deleted team");
      res.redirect(`/profile/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
}

