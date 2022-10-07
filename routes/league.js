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
router.put('/editLeagues/:id', ensureAuth, leagueController.editLeagues)

//edit a league from the league profile
router.put('/editLeague/:id', ensureAuth, leagueController.editLeague)

//pin a league from the leagues feed
router.put("/pinLeagues/:id", leagueController.pinLeagues);

//pin a league from the league profile
router.put("/pinLeague/:id", leagueController.pinLeague);

//delete leagues
router.delete("/deleteLeagues/:id", ensureAuth, leagueController.deleteLeagues);

module.exports = router;