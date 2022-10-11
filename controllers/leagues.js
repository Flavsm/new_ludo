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

            const teams = await Team.find().sort({ createdAt: "desc" }).lean();
            const league = await League.findById(req.params.id);

            const url = await req.originalUrl;

            res.render("post-league.ejs", { user: req.user, player: player, teams: teams, league: league, url: url });
        } catch (err) {
            console.log(err);
        }
    },
    createLeague: async (req, res) => {
        try {

            let newLeague = await League.create({
                league: req.body.league,
                sport: req.body.sport,
                allteams: req.body.allteams.split(',').map(el => el.toUpperCase().trim()),
                numberofteams: req.body.numberofteams,
                notes: req.body.notes,
                user: req.user.id,
            });

            // If user added image, upload image to cloudinary and to DB
            if (req.file) {
                const pattern = await cloudinary.uploader
                    .upload(req.file.path,
                        {
                            eager: [
                                { width: 400, height: 300, crop: "pad" },
                                { width: 300, height: 270, crop: "pad" },],
                            folder: 'ludo'
                        },)

                await League.findOneAndUpdate({ league: req.body.league },
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

            const leagues = await League.find({ user: req.user.id }).lean()
            const names = leagues.map(el => el.league)

            //Add new league to user's leagues
            await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $addToSet: { leagues: { $each: names } },
                }
            )

            console.log("League has been added!");
            res.redirect("/leagues");

        } catch (err) {
            console.log(err);
            res.redirect("/leagues")
        }
    },
    editLeagues: async (req, res) => {
        try {

            //Edit leagues from feed
            await League.findOneAndUpdate(
                { _id: req.params.id },
                [{
                    "$set": {
                        'league': req.body.league.toUpperCase(),
                        "sport": req.body.sport.toUpperCase(),
                        'allteams': req.body.allteams.split(',').map(el => el.toUpperCase().trim()),
                        'numberofteams': req.body.numberofteams,
                        'notes': req.body.notes.toUpperCase()
                    }
                }]
            );

            // If user added image, upload image to cloudinary and to DB
            if (req.file) {
                const pattern = await cloudinary.uploader
                    .upload(req.file.path,
                        {
                            eager: [
                                { width: 400, height: 300, crop: "pad" },
                                { width: 300, height: 270, crop: "pad" },],
                            folder: 'ludo'
                        },)

                await League.findOneAndUpdate({ league: req.body.league },
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



            const leagues = await League.find({ user: req.user.id }).lean()
            const allLeagues = await League.find().lean()
            const allTeams = await Team.find().lean()
            const allPlayers = await Player.find().lean()
            const pinned = allLeagues.map(el => el.league).concat(allTeams.map(el => el.team), allPlayers.map(el => el.player))
            const names = leagues.map(el => el.league)

            const user = await User.findById({ _id: req.user.id }).lean();

            //Remove old league from pinned and add new one if edited one was pinned
            user.pinned.forEach(async el => {
                if (!pinned.includes(el)) {
                    await User.findOneAndUpdate({ _id: req.user.id },
                        {
                            $pull: { pinned: el },
                        })
                    await User.findOneAndUpdate({ _id: req.user.id },
                        {

                            $addToSet: { pinned: req.body.league.toUpperCase() }
                        })

                }
            })

            //Remove edited league from user's leagues
            user.leagues.forEach(async (e) => {
                if (!allLeagues.map(el => el.league).includes(e)) {
                    await User.findOneAndUpdate(
                        { _id: req.user.id },
                        {
                            $pull: { leagues: e },
                        }
                    )
                }
            })


            //Add edited leagues from user's leagues
            await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $addToSet: { leagues: { $each: names } },
                }
            )

            res.redirect("/leagues");
        } catch (err) {
            console.log(err);
        }
    },
    editLeague: async (req, res) => {
        try {

            //Edit league from league post
            await League.findOneAndUpdate(
                { _id: req.params.id },
                [{
                    "$set": {
                        'league': req.body.league.toUpperCase(),
                        "sport": req.body.sport.toUpperCase(),
                        'allteams': req.body.allteams.split(',').map(el => el.toUpperCase().trim()),
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
                                { width: 300, height: 270, crop: "pad" },],
                            folder: 'ludo'
                        },)

                await League.findOneAndUpdate({ league: req.body.league },
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

            const leagues = await League.find({ user: req.user.id }).lean()
            const allLeagues = await League.find().lean()
            const allTeams = await Team.find().lean()
            const allPlayers = await Player.find().lean()
            const pinned = allLeagues.map(el => el.league).concat(allTeams.map(el => el.team), allPlayers.map(el => el.player))
            const names = allLeagues.map(el => el.league)

            const user = await User.findById({ _id: req.user.id }).lean();

            //Remove old league from pinned and add new one if edited one was pinned
            user.pinned.forEach(async el => {
                if (!pinned.includes(el)) {
                    await User.findOneAndUpdate({ _id: req.user.id },
                        {
                            $pull: { pinned: el },
                        })
                    await User.findOneAndUpdate({ _id: req.user.id },
                        {

                            $addToSet: { pinned: req.body.league.toUpperCase() }
                        })

                }
            })

            //Delete edited league from user's leagues
            user.leagues.forEach(async (e) => {
                if (!allLeagues.map(el => el.league).includes(e)) {
                    await User.findOneAndUpdate(
                        { _id: req.user.id },
                        {
                            $pull: { leagues: e },
                        }
                    )
                }
            })


            //Add edited league from user's leagues
            await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $addToSet: { leagues: { $each: names } },
                }
            )

            res.redirect(`/leagues/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    togglePinnedFeed: async (req, res) => {
        try {

            const obj = await League.findById(req.params.id).lean()
            const user = await User.findById(req.user)


            // Add or Remove leagues from pinned
            if (user.pinned.includes(obj.league)) {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $pull: { pinned: obj.league },
                    },
                    {
                        new: true
                    }
                )
            } else {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $push: { pinned: obj.league },

                    },
                    {
                        new: true
                    }
                )
            }

            console.log("Toggle pinned feed");
            res.redirect("/leagues");
        } catch (err) {
            console.log(err);
        }
    },
    togglePinned: async (req, res) => {
        try {

            const obj = await League.findById(req.params.id).lean()
            const user = await User.findById(req.user)

            // Add or Remove leagues from pinned
            if (user.pinned.includes(obj.league)) {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $pull: { pinned: obj.league },
                    },
                    {
                        new: true
                    }
                )
            } else {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $push: { pinned: obj.league },

                    },
                    {
                        new: true
                    }
                )
            }

            console.log("Toggle pinned");
            res.redirect(`/leagues/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    deleteLeagues: async (req, res) => {
        try {

            // Find post by id
            const league = await League.findById(req.params.id).lean()
            // Find user by id
            const user = await User.findById(req.user.id).lean()
            // Filter the post to be deleted from the pinned array
            const userFiltered = user.pinned.filter(el => el._id == (league._id).toString())

            // Delete image from cloudinary
            if (league.cloudinaryId) {
                await cloudinary.uploader.destroy(league.cloudinaryId);
            }

            // Delete league from pinned array
            if (user.pinned.find(el => el._id == req.params.id)) {
                await User.findByIdAndUpdate(
                    { _id: req.user.id },
                    {
                        $pull: { pinned: userFiltered[0] },
                    },
                    {
                        new: true
                    }
                )
            }
            //Delete league from leagues array
            await User.updateOne(
                { _id: req.user.id },
                {
                    $pull: { leagues: league.league }
                }
            )


            // Delete post from db
            await League.deleteOne({ _id: req.params.id });



            console.log("Deleted League");
            res.redirect("/leagues");
        } catch (err) {
            res.redirect("/leagues");
        }
    },
}
