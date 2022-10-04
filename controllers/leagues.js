const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const User = require('../models/User');
const Team = require('../models/Team');
const League = require('../models/League')
const { ObjectID } = require("mongodb");


module.exports = {
    getLeagues: async (req, res) => {
        try {
            const players = await Player.find().sort({ createdAt: "desc" }).lean();
            const teams = await Team.find().sort({ createdAt: "desc" }).lean();
            const leagues = await League.find().sort({ createdAt: "desc" }).lean();

            const player = await Player.findById(req.params.id);
            const url = await req.originalUrl;

            res.render("partial-feed.ejs", { user: req.user, players: players, player: player, teams: teams, leagues: leagues, url: url });
        } catch (err) {
            console.log(err);
        }
    },
    getLeague: async (req, res) => {
        try {
            const player = await Player.findById(req.params.id);
            const team = await Team.findById(req.params.id);
            const league = await League.findById(req.params.id);

            const url = await req.originalUrl;

            res.render("post-league.ejs", { user: req.user, player: player, team: team, league: league, url: url }); //changes req.user to req.email
        } catch (err) {
            console.log(err);
        }
    },
    createLeague: async (req, res) => {
        try {
            // Upload image to cloudinary

            /* const result = await cloudinary.uploader.upload(req.file.path); */


            // const pattern = await cloudinary.uploader
            //   .upload(req.file.path,
            //     {
            //       eager: [
            //         { width: 400, height: 300, crop: "pad" },
            //         { width: 220, height: 220, crop: "pad" },]
            //     })

            /* let img = cloudinary.image("LUDO/prof_dhezb9.jpg", {height: 300, width: 400, crop: "pad"}) */
            /* let img_default = "https://res.cloudinary.com/dprkasf7b/image/upload/c_pad,h_300,w_400/v1663434846/LUDO/prof_dhezb9.jpg" */

            let newLeague = await League.create({
                league: req.body.league,
                sport: req.body.sport,
                allteams: req.body.allteams.split(',').map(el => el.toUpperCase()),
                numberofteams: req.body.numberofteams,
                notes: req.body.notes,
                user: req.user.id,
            });

            const addIdToUser = await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $push: { leagues: { 'league': newLeague.league }, entries: newLeague.id, leagueEntries: newLeague.id },
                }
            )


            console.log("League has been added!");
            res.redirect("/leagues"); //changed from profile to home

        } catch (err) {
            console.log(err);
        }
    },
    editLeagues: async (req, res) => {
        try {
            await League.findOneAndUpdate(
                { _id: req.params.id },
                [{
                    "$set": {
                        'league': req.body.league.toUpperCase(),
                        "sport": req.body.sport.toUpperCase(),
                        'allteams': req.body.allteams.split(',').map(el => el.toUpperCase()),
                        'numberofteams': req.body.numberofteams,
                        'notes': req.body.notes.toUpperCase()
                    }
                }]
            );

            res.redirect("/leagues");
        } catch (err) {
            console.log(err);
        }
    },
    editLeague: async (req, res) => {
        try {
            await League.findOneAndUpdate(
                { _id: req.params.id },
                [{
                    "$set": {
                        'league': req.body.league.toUpperCase(),
                        "sport": req.body.sport.toUpperCase(),
                        'allteams': req.body.allteams.split(',').map(el => el.toUpperCase()),
                        'numberofteams': req.body.numberofteams,
                        'notes': req.body.notes.toUpperCase()
                    }
                }]
            );

            res.redirect(`/leagues/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    pinLeagues: async (req, res) => {
        try {
            await League.findOneAndUpdate(
                { _id: req.params.id },
                [{
                    "$set": { "pinned": { "$eq": [false, "$pinned"] } }
                }]
            );

            console.log("Toggle pinned");
            res.redirect("/leagues");
        } catch (err) {
            console.log(err);
        }
    },
    pinLeague: async (req, res) => {
        try {
            await League.findOneAndUpdate(
                { _id: req.params.id },
                [{
                    "$set": { "pinned": { "$eq": [false, "$pinned"] } }
                }]
            );

            console.log("Toggle pinned");
            res.redirect(`/leagues/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    deleteLeagues: async (req, res) => {
        try {

            // Find post by id
            let league = await League.findById({ _id: req.params.id });
            // Delete image from cloudinary
            //   await cloudinary.uploader.destroy(post.cloudinaryId);
            // Delete post from db
            await League.deleteOne({ _id: req.params.id });

            // Delete post from DB array
            const deleteIdFromUser = await User.updateOne(
                { _id: req.user.id },
                {
                    $pull: { leagues: { 'league': league.league }, entries: league.id, league: league.id },
                }
            )

            console.log("Deleted League");
            res.redirect("/leagues");
        } catch (err) {
            res.redirect("/leagues");
        }
    },
}
