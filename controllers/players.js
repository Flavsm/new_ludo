const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const User = require('../models/User');
const Team = require('../models/Team');

module.exports = {
    getPlayers: async (req, res) => {

        try {
            const players = await Player.find().sort({ createdAt: "desc" }).lean();
            const player = await Player.findById(req.params.id);
            const url = await req.originalUrl;

            res.render("partial-feed.ejs", { players: players, user: req.user, player: player, url: url });
        } catch (err) {
            console.log(err);
        }
    },

    getPlayer: async (req, res) => {
        try {
            const player = await Player.findById(req.params.id);
            const team = await Team.find({ team: player.team });
            const url = await req.originalUrl;

            res.render("post-player.ejs", { player: player, user: req.user, team: team, url: url });
        } catch (err) {
            console.log(err);
        }
    },
    createPlayer: async (req, res) => {
        try {


            let newPlayer = await Player.create({
                team: req.body.team,
                player: req.body.player,
                sport: req.body.sport,
                position: req.body.position,
                win: req.body.win,
                loss: req.body.loss,
                notes: req.body.notes,
                user: req.user.id,

            });

            // If user added image, upload image to cloudinary and to user db
            if (req.file) {
                const pattern = await cloudinary.uploader
                    .upload(req.file.path,
                        {
                            eager: [
                                { width: 400, height: 300, crop: "pad" },
                                { width: 300, height: 270, crop: "pad" },
                            ],
                            folder: 'ludo'
                        },
                    )

                await Player.findOneAndUpdate({ player: req.body.player },
                    {
                        $set: {
                            image: {
                                feed: pattern.eager[0].secure_url,
                                profile: pattern.eager[1].secure_url
                            },
                            cloudinaryId: pattern.public_id
                        }
                    })
            }

            await User.findOneAndUpdate(
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

            // If user added image, upload image to cloudinary and to user db
            if (req.file) {
                const pattern = await cloudinary.uploader
                    .upload(req.file.path,
                        {
                            eager: [
                                { width: 400, height: 300, crop: "pad" },
                                { width: 300, height: 270, crop: "pad" },
                            ],
                            folder: 'ludo'
                        },
                    )

                await Player.findOneAndUpdate({ player: req.body.player },
                    {
                        $set: {
                            image: {
                                feed: pattern.eager[0].secure_url,
                                profile: pattern.eager[1].secure_url
                            },
                            cloudinaryId: pattern.public_id
                        }
                    })
            }

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
                    }
                }]
            );

            // If user added image, upload image to cloudinary and to user db
            if (req.file) {
                const pattern = await cloudinary.uploader
                    .upload(req.file.path,
                        {
                            eager: [
                                { width: 400, height: 300, crop: "pad" },
                                { width: 300, height: 270, crop: "pad" },
                            ],
                            folder: 'ludo'
                        },
                    )

                await Player.findOneAndUpdate({ player: req.body.player },
                    {
                        $set: {
                            image: {
                                feed: pattern.eager[0].secure_url,
                                profile: pattern.eager[1].secure_url
                            },
                            cloudinaryId: pattern.public_id
                        }
                    })
            }

            res.redirect(`/players/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    togglePinnedFeed: async (req, res) => {
        try {

            const obj = await Player.findById(req.params.id).lean()
            const user = await User.findById(req.user)


            if (user.pinned.find(el => el._id == req.params.id)) {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $pull: { pinned: obj },
                    },
                    {
                        new: true
                    }
                )
            } else {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $push: { pinned: obj },

                    },
                    {
                        new: true
                    }
                )
            }

            console.log("Toggle pinned feed");
            res.redirect("/players");
        } catch (err) {
            console.log(err);
        }
    },
    togglePinned: async (req, res) => {
        try {

            const obj = await Player.findById(req.params.id).lean()
            const user = await User.findById(req.user)


            if (user.pinned.find(el => el._id == req.params.id)) {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $pull: { pinned: obj },
                    },
                    {
                        new: true
                    }
                )
            } else {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $push: { pinned: obj },

                    },
                    {
                        new: true
                    }
                )
            }

            console.log("Toggle pinned");
            res.redirect(`/players/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    createRow: async (req, res) => {
        try {
            await Player.findOneAndUpdate(
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
            // let player = await Player.findOne({
            //     'table._id': req.params.id
            // });

            await Player.findOneAndUpdate(
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
            const player = await Player.findOne({
                'table._id': req.params.id
            });

            // Delete row from DB array
            await Player.findOneAndUpdate({
                'table._id': req.params.id
            },
                {
                    $pull: { 'table': player.table.filter(el => el._id == req.params.id)[0] }
                },
                {
                    new: true
                }
            )

            console.log("Deleted Row");
            res.redirect(`/players/${player._id}`);
        } catch (err) {
            res.redirect("/players");
        }
    },
    deletePlayer: async (req, res) => {
        try {

            // Find post by id
            const player = await Player.findById(req.params.id).lean()
            const user = await User.findById(req.user)

            // Delete image from cloudinary
            if (player.cloudinaryId) {
                await cloudinary.uploader.destroy(player.cloudinaryId);
            }

            // Delete player from pinned array
            if (user.pinned.find(el => el._id == req.params.id)) {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $pull: { pinned: player },
                    },
                    {
                        new: true
                    }
                )
            }


            // Delete post from db
            await Player.deleteOne({ _id: req.params.id });


            console.log("Deleted Player");
            res.redirect("/players");
        } catch (err) {
            res.redirect("/players");
        }
    }
}



