const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const leagueController = require("../controllers/leagues");
const { ensureAuth, ensureGuest } = require("../middleware/auth");


//get the feed of all leagues
router.get("/", ensureAuth, leagueController.getLeagues);

//get the profile of a specific league
router.get("/:id", ensureAuth, leagueController.getLeague);

//create new league from the leagues feed
router.post("/createLeague", upload.single("file"), leagueController.createLeague);

//edit a league from the leagues feed
router.put('/editLeagues/:id', ensureAuth, upload.single("file"), leagueController.editLeagues)

//edit a league from the league profile
router.put('/editLeague/:id', ensureAuth, upload.single("file"), leagueController.editLeague)

//pin a team from the teams feed
router.put('/togglePinnedFeed/:id', leagueController.togglePinnedFeed);

//pin a team from the team profile
router.put('/togglePinned/:id', leagueController.togglePinned);

//delete leagues
router.delete("/deleteLeagues/:id", ensureAuth, leagueController.deleteLeagues);

module.exports = router;