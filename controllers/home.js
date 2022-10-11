const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const User = require('../models/User');
const Team = require('../models/Team');
const League = require('../models/League');
const user = require("./user");


module.exports = {
    getHome: async (req, res) => {
        try {
            //get all players with user's id, get all players, concat both arrays and filter the pinned ones
            const players = await Player.find({ user: req.user.id }).lean();
            const allPlayers = await Player.find()


            //get all teams with user's id, get all teams, concat both arrays and filter the pinned ones
            const teams = await Team.find({ user: req.user.id }).lean();
            const allTeams = await Team.find()

            //get all leagues with user's id, get all leagues, concat both arrays and filter the pinned ones
            const leagues = await League.find({ user: req.user.id }).lean();
            const allLeagues = await League.find()

            let pinnedArr = []

            req.user.pinned.forEach(el => {
                if (allPlayers.find(e => e.player == el)) {
                    pinnedArr.push(allPlayers.find(em => em.player == el))
                } else if (allTeams.find(e => e.team == el)) {
                    pinnedArr.push(allTeams.find(em => em.team == el))
                } else {
                    pinnedArr.push(allLeagues.find(em => em.league == el))
                }
            })

            // get the player from params
            const player = await Player.findById(req.params.id);
            //get users by id
            const users = await User.findById(req.params.id)
            //get url
            const url = await req.originalUrl;

            res.render("home.ejs", { players: players, users: users, player: player, teams: teams, leagues: leagues, user: req.user, url: url, pinnedArr: pinnedArr });

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
                                { width: 300, height: 270, crop: "pad" },]
                        })

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


            const addIdToUser = await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $push: { entries: newPlayer.id },
                }
            )

            console.log("Player has been added!");
            res.redirect("/home");

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
                                { width: 300, height: 270, crop: "pad" },]
                        })

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

            // const teams = await Team.find({ user: req.user.id }).lean()
            // const names = teams.map(el => el.team)

            const addIdToUser = await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $push: { teams: req.body.team },
                }
            )

            console.log("Team has been added!");
            res.redirect("/home");

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

            // If user added image, upload image to cloudinary and to user db
            if (req.file) {
                const pattern = await cloudinary.uploader
                    .upload(req.file.path,
                        {
                            eager: [
                                { width: 400, height: 300, crop: "pad" },
                                { width: 300, height: 270, crop: "pad" },]
                        })

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

            // const leagues = await League.find({ user: req.user.id }).lean()
            // const names = leagues.map(el => el.league)

            const addIdToUser = await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $push: { leagues: req.body.league },
                }
            )

            console.log("League has been added!");
            res.redirect("/home");

        } catch (err) {
            console.log(err);
        }
    },

}