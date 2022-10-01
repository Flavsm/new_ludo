const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const User = require('../models/User');
const Team = require('../models/Team');
const { ObjectID } = require("mongodb");
// const Table = require('../models/Table');

module.exports = {
    getTeams: async (req, res) => {
        try {
            const players = await Player.find().sort({ createdAt: "desc" }).lean();
            const teams = await Team.find().sort({ createdAt: "desc" }).lean();
            /* const userPosts = await Post.find(req.user) */
            const player = await Player.findById(req.params.id);
            const url = await req.originalUrl;
            /* console.log(userPosts) */
            res.render("partial-feed.ejs", { players: players, user: req.user, player: player, teams: teams, url: url });
        } catch (err) {
            console.log(err);
        }
    },
    getTeam: async (req, res) => {
        try {
            const player = await Player.findById(req.params.id);
            const team = await Team.findById(req.params.id);
            const url = await req.originalUrl;

            /* console.log(post) */
            res.render("post-team.ejs", { player: player, user: req.user, team: team, url: url }); //changes req.user to req.email
        } catch (err) {
            console.log(err);
        }
    },
    createTeam: async (req, res) => {
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

            let newTeam = await Team.create({
                team: req.body.team,
                sport: req.body.sport,
                numberofplayers: req.body.numberofplayers,
                win: req.body.win,
                loss: req.body.loss,
                notes: req.body.notes,
                user: req.user.id,
            });

            /* req.user.entries.push(newPost.id) */
            // console.log(req.body)

            const addIdToUser = await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $push: { teams: { 'team': newTeam.team }, entries: newTeam.id, teamEntries: newTeam.id },
                }
            )

            console.log("Team has been added!");
            res.redirect("/teams"); //changed from profile to home

        } catch (err) {
            console.log(err);
        }
    },
    editTeams: async (req, res) => {
        try {
            await Team.findOneAndUpdate(
                { _id: req.params.id },
                [{
                    "$set": {
                        'team': req.body.team.toUpperCase(),
                        "sport": req.body.sport.toUpperCase(),
                        'numberofplayers': req.body.numberofplayers,
                        'win': req.body.win,
                        'loss': req.body.loss,
                        'notes': req.body.notes.toUpperCase()
                    }
                }]
            );

            res.redirect("/teams");
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
                        'team': req.body.team.toUpperCase(),
                        "sport": req.body.sport.toUpperCase(),
                        'numberofplayers': req.body.numberofplayers,
                        'win': req.body.win,
                        'loss': req.body.loss,
                        'notes': req.body.notes.toUpperCase()
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
    createRow: async (req, res) => {
        try {
            let newRow = await Team.findOneAndUpdate(
                { _id: req.params.id },
                {
                    '$push': { 'table': { 'row': { 'cell1': req.body.cell1, 'cell2': req.body.cell2, 'cell3': req.body.cell3, 'cell4': req.body.cell4, 'cell5': req.body.cell5, 'cell6': req.body.cell6, 'cell7': req.body.cell7, 'cell8': req.body.cell8, 'cell9': req.body.cell9 } } }

                },
                {
                    new: true
                }
            )


            console.log("Added row");
            res.redirect(`/teams/${req.params.id}`);
        } catch {
            res.redirect(`/teams/${req.params.id}`);
        }
    },
    editRow: async (req, res) => {
        try {

            // Find post by id
            let team = await Team.findOne({
                'table._id': req.params.id
            });

            console.log(team)

            let editRow = await Team.findOneAndUpdate(
                { 'table._id': req.params.id },
                [{
                    '$set': { 'table': { 'row': { 'cell1': req.body.cell1, 'cell2': req.body.cell2, 'cell3': req.body.cell3, 'cell4': req.body.cell4, 'cell5': req.body.cell5, 'cell6': req.body.cell6, 'cell7': req.body.cell7, 'cell8': req.body.cell8, 'cell9': req.body.cell9 } } }
                }],
                {
                    new: true
                }
            )

            console.log("Edited row");
            res.redirect(`/teams/${team._id}`);
        }
        catch {
            res.redirect(`/teams/${team._id}`);
        }
    },
    deleteRow: async (req, res) => {
        try {

            // Find post by id
            let team = await Team.findOne({
                'table._id': req.params.id
            });

            // Delete image from cloudinary
            //   await cloudinary.uploader.destroy(post.cloudinaryId);

            // Delete row from DB array
            await Team.findOneAndUpdate({
                'table._id': req.params.id
            },
                {
                    $pull: { 'table': team.table.filter(el => el._id == req.params.id)[0] }
                },
                {
                    new: true
                }
            )

            console.log("Deleted Row");
            res.redirect(`/teams/${team._id}`);
        } catch (err) {
            res.redirect("/teams");
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
                    $pull: { teams: { 'team': team.team }, entries: team.id, teamEntries: team.id },
                }
            )

            console.log("Deleted Post");
            res.redirect("/teams");
        } catch (err) {
            res.redirect("/teams");
        }
    },
}
