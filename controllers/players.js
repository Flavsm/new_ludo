const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const User = require('../models/User');
const Team = require('../models/Team');

module.exports = {
    getPlayers: async (req, res) => {

        try {
            const players = await Player.find().sort({ createdAt: "desc" }).lean();
            /* const userPosts = await Post.find(req.user) */
            const player = await Player.findById(req.params.id);
            const url = await req.originalUrl;

            res.render("partial-feed.ejs", { players: players, user: req.user, player: player, /* userPosts: userPosts, */ url: url });
        } catch (err) {
            console.log(err);
        }
    },

    getPlayer: async (req, res) => {
        try {
            const player = await Player.findById(req.params.id);
            const team = await Team.findById(req.params.id);
            const url = await req.originalUrl;
            /* console.log(post) */
            res.render("post-player.ejs", { player: player, user: req.user, team: team, url: url }); //changes req.user to req.email
        } catch (err) {
            console.log(err);
        }
    },
    createPlayer: async (req, res) => {
        try {
            // Upload image to cloudinary

            /* const result = await cloudinary.uploader.upload(req.file.path); */
            console.log(req.body)

            const pattern = await cloudinary.uploader
                .upload(req.file.path,
                    {
                        eager: [
                            { width: 400, height: 300, crop: "pad" },
                            { width: 220, height: 220, crop: "pad" },]
                    })

            /* let img = cloudinary.image("LUDO/prof_dhezb9.jpg", {height: 300, width: 400, crop: "pad"}) */
            /* let img_default = "https://res.cloudinary.com/dprkasf7b/image/upload/c_pad,h_300,w_400/v1663434846/LUDO/prof_dhezb9.jpg" */

            let newPlayer = await Player.create({
                team: req.body.team,
                player: req.body.player,
                sport: req.body.sport,
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

            console.log(req.body)
            const addIdToUser = await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $push: { entries: newPlayer.id },
                }
            )

            console.log("Player has been added!");
            res.redirect("/players"); //changed from profile to home

        } catch (err) {
            console.log(err);
        }
    },
    editPlayers: async (req, res) => {
        try {
            await Player.findOneAndUpdate(
                { _id: req.params.id },
                [{
                    "$set": {
                        'player': req.body.player.toUpperCase(),
                        "team": req.body.team.toUpperCase(),
                        'sport': req.body.sport.toUpperCase(),
                        'position': req.body.position,
                        'win': req.body.win,
                        'loss': req.body.loss,
                        'notes': req.body.notes.toUpperCase()
                    }
                }]
            );

            res.redirect("/players");
        } catch (err) {
            console.log(err);
        }
    },
    editPlayer: async (req, res) => {
        try {
            await Player.findOneAndUpdate(
                { _id: req.params.id },
                [{
                    "$set": {
                        'player': req.body.player.toUpperCase(),
                        "team": req.body.team.toUpperCase(),
                        'sport': req.body.sport.toUpperCase(),
                        'position': req.body.position,
                        'win': req.body.win,
                        'loss': req.body.loss,
                        'notes': req.body.notes.toUpperCase()
                    }
                }]
            );

            res.redirect(`/players/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    pinPlayer: async (req, res) => {
        try {
            await Player.findOneAndUpdate(
                { _id: req.params.id },
                [{
                    "$set": { "pinned": { "$eq": [false, "$pinned"] } }
                }]
            );

            console.log("Toggle pinned");
            res.redirect(`/players/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    createRow: async (req, res) => {
        try {
            let newRow = await Player.findOneAndUpdate(
                { _id: req.params.id },
                {
                    '$push': { 'table': { 'row': { 'cell1': req.body.cell1, 'cell2': req.body.cell2, 'cell3': req.body.cell3, 'cell4': req.body.cell4, 'cell5': req.body.cell5, 'cell6': req.body.cell6, 'cell7': req.body.cell7, 'cell8': req.body.cell8, 'cell9': req.body.cell9 } } }

                },
                {
                    new: true
                }
            )


            console.log("Added row");
            res.redirect(`/players/${req.params.id}`);
        } catch {
            res.redirect(`/players/${req.params.id}`);
        }
    },
    editRow: async (req, res) => {
        try {

            // Find post by id
            let player = await Player.findOne({
                'table._id': req.params.id
            });

            console.log(team)

            let editRow = await Player.findOneAndUpdate(
                { 'table._id': req.params.id },
                [{
                    '$set': { 'table': { 'row': { 'cell1': req.body.cell1, 'cell2': req.body.cell2, 'cell3': req.body.cell3, 'cell4': req.body.cell4, 'cell5': req.body.cell5, 'cell6': req.body.cell6, 'cell7': req.body.cell7, 'cell8': req.body.cell8, 'cell9': req.body.cell9 } } }
                }],
                {
                    new: true
                }
            )

            console.log("Edited row");
            res.redirect(`/players/${team._id}`);
        }
        catch {
            res.redirect(`/players/${team._id}`);
        }
    },
    deleteRow: async (req, res) => {
        try {

            // Find post by id
            let player = await Player.findOne({
                'table._id': req.params.id
            });

            // Delete image from cloudinary
            //   await cloudinary.uploader.destroy(post.cloudinaryId);

            // Delete row from DB array
            await Player.findOneAndUpdate({
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
            res.redirect(`/players/${team._id}`);
        } catch (err) {
            res.redirect("/players");
        }
    },
    deletePlayer: async (req, res) => {
        try {

            // Find post by id
            let player = await Player.findById({ _id: req.params.id });

            // Delete image from cloudinary
            await cloudinary.uploader.destroy(player.cloudinaryId);
            // Delete post from db
            await Player.deleteOne({ _id: req.params.id });

            // Delete post from DB array
            const deleteIdFromUser = await User.updateOne(
                { _id: req.user.id },
                {
                    $pull: { entries: player.id }
                }
            )

            console.log("Deleted Player");
            res.redirect("/players");
        } catch (err) {
            res.redirect("/players");
        }
    }
}



