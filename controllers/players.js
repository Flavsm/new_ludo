const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const User = require('../models/User');
const Team = require('../models/Team');
const League = require('../models/League')

module.exports = {
    getPlayers: async (req, res) => {

        try {
            const players = await Player.find().sort({ createdAt: "desc" }).lean();
            const teams = await Team.find().sort({ createdAt: "desc" }).lean();
            const leagues = await League.find().sort({ createdAt: "desc" }).lean();

            const player = await Player.findById(req.params.id);
            const url = await req.originalUrl;

            res.render("partial-feed.ejs", { players: players, teams: teams, leagues: leagues, user: req.user, player: player, url: url });
        } catch (err) {
            console.log(err);
        }
    },

    getPlayer: async (req, res) => {
        try {
            const players = await Player.find().sort({ createdAt: "desc" }).lean();
            const teams = await Team.find().sort({ createdAt: "desc" }).lean();
            const leagues = await League.find().sort({ createdAt: "desc" }).lean();

            const player = await Player.findById(req.params.id);
            const team = await Team.find({ team: player.team });
            const url = await req.originalUrl;

            res.render("post-player.ejs", { player: player, players: players, user: req.user, team: team, teams: teams, leagues: leagues, url: url });
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
            res.redirect("/players");

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

            const players = await Player.find({ user: req.user.id }).lean()
            const allPlayers = await Player.find().lean()
            const names = allPlayers.map(el => el.player)

            const user = await User.findById({ _id: req.user.id }).lean();


            //Remove old player from pinned and add new one if edited one was pinned
            user.pinned.forEach(async el => {
                if (!names.includes(el)) {
                    await User.findOneAndUpdate({ _id: req.user.id },
                        {
                            $pull: { pinned: el },
                        })
                    await User.findOneAndUpdate({ _id: req.user.id },
                        {

                            $addToSet: { pinned: req.body.player.toUpperCase() }
                        })

                }
            })

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

            const players = await Player.find({ user: req.user.id }).lean()
            const names = players.map(el => el.player)

            const user = await User.findById({ _id: req.user.id }).lean();

            //Remove old player from pinned and add new one if edited one was pinned
            user.pinned.forEach(async el => {
                if (!names.includes(el)) {
                    await User.findOneAndUpdate({ _id: req.user.id },
                        {
                            $pull: { pinned: el },
                        })
                    await User.findOneAndUpdate({ _id: req.user.id },
                        {

                            $addToSet: { pinned: req.body.player.toUpperCase() }
                        })

                }
            })



            res.redirect(`/players/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    togglePinnedFeed: async (req, res) => {
        try {

            const obj = await Player.findById(req.params.id).lean()
            const user = await User.findById(req.user)

            // Add or Remove leagues from pinned
            if (user.pinned.includes(obj.player)) {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $pull: { pinned: obj.player },
                    },
                    {
                        new: true
                    }
                )
            } else {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $push: { pinned: obj.player },

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


            if (user.pinned.includes(obj.player)) {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $pull: { pinned: obj.player },
                    },
                    {
                        new: true
                    }
                )
            } else {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $push: { pinned: obj.player },

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

            //Find post by id
            let player = await Player.findOne({
                'table._id': req.params.id
            });

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
            res.redirect(`/players/${player._id}`);
        }
        catch {
            res.redirect(`/players/${player._id}`);
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
            const user = await User.findById(req.user.id).lean()
            // Filter the post to be deleted from the pinned array
            const userFiltered = user.pinned.filter(el => el._id == (player._id).toString())

            // Delete image from cloudinary
            if (player.cloudinaryId) {
                await cloudinary.uploader.destroy(player.cloudinaryId);
            }

            // Delete player from pinned array
            if (user.pinned.find(el => el._id == req.params.id)) {
                await User.findOneAndUpdate(
                    { _id: req.user.id },
                    {
                        $pull: { pinned: userFiltered[0] },
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



