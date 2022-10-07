const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const User = require('../models/User');
const Team = require('../models/Team');
const League = require('../models/League')


module.exports = {
    getHome: async (req, res) => {
        try {
            //get all posts users id
            const players = await Player.find({ user: req.user.id });
            //get all posts users id
            const teams = await Team.find({ user: req.user.id });
            //get all posts users id
            const leagues = await League.find({ user: req.user.id });
            // get all posts ids
            const player = await Player.findById(req.params.id);
            //get users by id
            const users = await User.findById(req.params.id)
            //get url
            const url = await req.originalUrl;

            res.render("home.ejs", { players: players, users: users, player: player, teams: teams, leagues: leagues, user: req.user, url: url }); //changed from profile.ejs to home.ejs //changes req.user to req.email

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
            res.redirect("/home"); //changed from profile to home

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


            const addIdToUser = await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $push: { teams: { 'team': newTeam.team }, entries: newTeam.id, teamEntries: newTeam.id },
                }
            )

            console.log("Team has been added!");
            res.redirect("/home"); //changed from profile to home

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


            const addIdToUser = await User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $push: { leagues: { 'league': newLeague.league }, entries: newLeague.id, leagueEntries: newLeague.id },
                }
            )

            console.log("League has been added!");
            res.redirect("/home"); //changed from profile to home

        } catch (err) {
            console.log(err);
        }
    },

}