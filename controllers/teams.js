const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const User = require('../models/User');
const Team = require('../models/Team');
const League = require('../models/League')
const { ObjectID } = require("mongodb");

module.exports = {
    getTeams: async (req, res) => {
        try {
            const players = await Player.find().sort({ createdAt: "desc" }).lean();
            const teams = await Team.find().sort({ createdAt: "desc" }).lean();
            const leagues = await League.find().sort({ createdAt: "desc" }).lean();
            const player = await Player.findById(req.params.id);
            const url = await req.originalUrl;
            /* console.log(userPosts) */
            res.render("partial-feed.ejs", { players: players, user: req.user, player: player, teams: teams, leagues: leagues, url: url });
        } catch (err) {
            console.log(err);
        }
    },
    getTeam: async (req, res) => {
        try {
            const players = await Player.find().sort({ createdAt: "desc" }).lean();
            const player = await Player.findById(req.params.id);
            const teams = await Team.find().sort({ createdAt: "desc" }).lean();
            const team = await Team.findById(req.params.id).lean();
            const league = await League.find({ allteams: team.team });

            const url = await req.originalUrl;

            res.render("post-team.ejs", { player: player, players: players, user: req.user, team: team, teams: teams, league: league, url: url });
        } catch (err) {
            console.log(err);
        }
    },
    createTeam: async (req, res) => {
        try {

            let newTeam = await Team.create({
                team: req.body.team,
                sport: req.body.sport,
                numberofplayers: req.body.numberofplayers,
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
                        },)

                await Team.findOneAndUpdate({ team: req.body.team },
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

            const teams = await Team.find({ user: req.user.id }).lean()
            const names = teams.map(el => el.team)

            //Add new team to user's team
            await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $addToSet: { teams: { $each: names } },
                }
            )

            console.log("Team has been added!");
            res.redirect("/teams");

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
                        },)

                await Team.findOneAndUpdate({ team: req.body.team },
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


            const teams = await Team.find({ user: req.user.id }).lean()
            const names = teams.map(el => el.team)

            const user = await User.findById({ _id: req.user.id }).lean();


            //Remove old league from pinned and add new one if edited one was pinned
            user.pinned.forEach(async el => {
                if (!names.includes(el)) {
                    await User.findOneAndUpdate({ _id: req.user.id },
                        {
                            $pull: { pinned: el },
                        })
                    await User.findOneAndUpdate({ _id: req.user.id },
                        {

                            $addToSet: { pinned: req.body.team.toUpperCase() }
                        })

                }
            })

            //Remove edited team from user's teams
            user.teams.forEach(async (e) => {
                if (!teams.map(el => el.team).includes(e)) {
                    await User.findOneAndUpdate(
                        { _id: req.user.id },
                        {
                            $pull: { teams: e },
                        }
                    )
                }
            })

            //Add edited teams from user's teams
            await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $addToSet: { teams: { $each: names } },
                }
            )

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
                        },)

                await Team.findOneAndUpdate({ team: req.body.team },
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

            const teams = await Team.find({ user: req.user.id }).lean()
            const names = teams.map(el => el.team)

            const user = await User.findById({ _id: req.user.id }).lean();

            //Remove old team from pinned and add new one if edited one was pinned
            user.pinned.forEach(async el => {
                if (!names.includes(el)) {
                    await User.findOneAndUpdate({ _id: req.user.id },
                        {
                            $pull: { pinned: el },
                        })
                    await User.findOneAndUpdate({ _id: req.user.id },
                        {

                            $addToSet: { pinned: req.body.team.toUpperCase() }
                        })

                }
            })



            //Delete edited team from user's teams
            user.teams.forEach(async (e) => {
                if (!teams.map(el => el.team).includes(e)) {
                    await User.findOneAndUpdate(
                        { _id: req.user.id },
                        {
                            $pull: { teams: e },
                        }
                    )
                }
            })

            //Add edited team from user's teams
            await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $addToSet: { teams: { $each: names } },
                }
            )

            res.redirect(`/teams/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    togglePinnedFeed: async (req, res) => {
        try {

            const obj = await Team.findById(req.params.id).lean()
            const user = await User.findById(req.user)

            // Add or Remove leagues from pinned
            if (user.pinned.includes(obj.team)) {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $pull: { pinned: obj.team },
                    },
                    {
                        new: true
                    }
                )
            } else {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $push: { pinned: obj.team },

                    },
                    {
                        new: true
                    }
                )
            }

            console.log("Toggle pinned feed");
            res.redirect("/teams");
        } catch (err) {
            console.log(err);
        }
    },
    togglePinned: async (req, res) => {
        try {

            const obj = await Team.findById(req.params.id).lean()
            const user = await User.findById(req.user)


            if (user.pinned.includes(obj.team)) {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $pull: { pinned: obj.team },
                    },
                    {
                        new: true
                    }
                )
            } else {
                await User.updateOne(
                    { _id: req.user.id },
                    {
                        $push: { pinned: obj.team },

                    },
                    {
                        new: true
                    }
                )
            }

            console.log("Toggle pinned");
            res.redirect(`/teams/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    createRow: async (req, res) => {
        try {
            await Team.findOneAndUpdate(
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

            await Team.findOneAndUpdate(
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
            const team = await Team.findById(req.params.id).lean();
            const user = await User.findById(req.user.id).lean()
            // Filter the post to be deleted from the pinned array
            const userFiltered = user.pinned.filter(el => el._id == (team._id).toString())

            // Delete image from cloudinary
            if (team.cloudinaryId) {
                await cloudinary.uploader.destroy(team.cloudinaryId);
            }

            // Delete post from pinned array
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

            // Delete team from teams array
            await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $pull: { teams: team.team },
                },
                {
                    new: true
                }
            )

            // Delete post from db
            await Team.deleteOne({ _id: req.params.id });

            console.log("Deleted Team");
            res.redirect("/teams");
        } catch (err) {
            res.redirect("/teams");
        }
    },
}
