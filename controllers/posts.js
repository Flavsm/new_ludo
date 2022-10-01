const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const User = require('../models/User');
const Team = require('../models/Team');

module.exports = {
  // getHome: async (req, res) => {
  //   try {
  //     //get all posts users id
  //     const players = await Player.find({ user: req.user.id });
  //     //get all posts users id
  //     const teams = await Team.find({ user: req.user.id });
  //     // get all posts ids
  //     const player = await Player.findById(req.params.id);
  //     //get users by id
  //     const users = await User.findById(req.params.id)
  //     //get url
  //     const url = await req.originalUrl;

  //     res.render("home.ejs", { players: players, users: users, player: player, teams: teams, user: req.user, url: url }); //changed from profile.ejs to home.ejs //changes req.user to req.email

  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  // getPost: async (req, res) => {
  //   try {
  //     const player = await Player.findById(req.params.id);
  //     const team = await Team.findById(req.params.id);
  //     const url = await req.originalUrl;
  //     /* console.log(post) */
  //     res.render("post.ejs", { player: player, user: req.user, team: team, url: url }); //changes req.user to req.email
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  // createPlayer: async (req, res) => {
  //   try {
  //     // Upload image to cloudinary

  //     /* const result = await cloudinary.uploader.upload(req.file.path); */


  //     const pattern = await cloudinary.uploader
  //       .upload(req.file.path,
  //         {
  //           eager: [
  //             { width: 400, height: 300, crop: "pad" },
  //             { width: 220, height: 220, crop: "pad" },]
  //         })

  //     /* let img = cloudinary.image("LUDO/prof_dhezb9.jpg", {height: 300, width: 400, crop: "pad"}) */
  //     /* let img_default = "https://res.cloudinary.com/dprkasf7b/image/upload/c_pad,h_300,w_400/v1663434846/LUDO/prof_dhezb9.jpg" */

  //     let newPost = await Player.create({
  //       team: req.body.team,
  //       player: req.body.player,
  //       position: req.body.position,
  //       win: req.body.win,
  //       loss: req.body.loss,
  //       notes: req.body.notes,
  //       user: req.user.id,
  //       image: {
  //         feed: pattern.eager[0].secure_url,
  //         profile: pattern.eager[1].secure_url
  //       },
  //       cloudinaryId: pattern.public_id
  //     });

  //     /* req.user.entries.push(newPost.id) */

  //     const addIdToUser = await User.findOneAndUpdate(
  //       { _id: req.user.id },
  //       {
  //         $push: { entries: newPost.id },
  //       }
  //     )
  //     /* console.log(req.user) */ //gets the user model
  //     /* console.log(newPost) */ //get the new post info
  //     //  console.log(req.body)

  //     console.log("Player has been added!");
  //     res.redirect("/home"); //changed from profile to home

  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  // createTeam: async (req, res) => {
  //   try {
  //     // Upload image to cloudinary

  //     /* const result = await cloudinary.uploader.upload(req.file.path); */


  //     // const pattern = await cloudinary.uploader
  //     //   .upload(req.file.path,
  //     //     {
  //     //       eager: [
  //     //         { width: 400, height: 300, crop: "pad" },
  //     //         { width: 220, height: 220, crop: "pad" },]
  //     //     })

  //     /* let img = cloudinary.image("LUDO/prof_dhezb9.jpg", {height: 300, width: 400, crop: "pad"}) */
  //     /* let img_default = "https://res.cloudinary.com/dprkasf7b/image/upload/c_pad,h_300,w_400/v1663434846/LUDO/prof_dhezb9.jpg" */

  //     let newTeam = await Team.create({
  //       team: req.body.team.toLowerCase(),
  //       sport: req.body.sport,
  //       numberofplayers: req.body.numberofplayers,
  //       win: req.body.win,
  //       loss: req.body.loss,
  //       notes: req.body.notes,
  //       user: req.user.id,
  //     });

  //     /* req.user.entries.push(newPost.id) */
  //     // console.log(req.body)

  //     const addIdToUser = await User.findOneAndUpdate(
  //       { _id: req.user.id },
  //       {
  //         $push: { teams: newTeam.team, entries: newTeam.id, teamEntries: newTeam.id },
  //       }
  //     )

  //     console.log("Team has been added!");
  //     res.redirect("/home"); //changed from profile to home

  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  createLeague: async (req, res) => {
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

      let newPost = await Player.create({
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

      /* req.user.entries.push(newPost.id) */

      const addIdToUser = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $push: { entries: newPost.id },
        }
      )
      /* console.log(req.user) */ //gets the user model
      /* console.log(newPost) */ //get the new post info
      console.log(req.body)

      console.log("Player has been added!");
      res.redirect("/home"); //changed from profile to home

    } catch (err) {
      console.log(err);
    }
  },
  // pinPost: async (req, res) => {
  //   try {
  //     await Player.findOneAndUpdate(
  //       { _id: req.params.id },
  //       [{
  //         "$set": { "pinned": { "$eq": [false, "$pinned"] } }
  //       }]
  //     );

  //     console.log("Toggle pinned");
  //     res.redirect(`/post/${req.params.id}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  // createTable: async (req, res) => {
  //   try {
  //     await Player.findOneAndUpdate(
  //       { _id: req.params.id },
  //       [{
  //         "$set": { "table": { 'row': [req.body.cell1], 'column': [req.body.cell2] } }
  //       }]
  //     );

  //     const player = await Player.findById(req.params.id);

  //     console.log(player)
  //     console.log(req.body)

  //     console.log("Table created");
  //     res.redirect(`/post/${req.params.id}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  // deletePost: async (req, res) => {
  //   try {

  //     // Find post by id
  //     let player = await Player.findById({ _id: req.params.id });

  //     // Delete image from cloudinary
  //     await cloudinary.uploader.destroy(player.cloudinaryId);
  //     // Delete post from db
  //     await Player.deleteOne({ _id: req.params.id });

  //     // Delete post from DB array
  //     const deleteIdFromUser = await User.updateOne(
  //       { _id: req.user.id },
  //       {
  //         $pull: { entries: post.id }
  //       }
  //     )

  //     console.log("Deleted Post");
  //     res.redirect("/players");
  //   } catch (err) {
  //     res.redirect("/players");
  //   }
  // },
};
