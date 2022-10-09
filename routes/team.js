const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const teamController = require("../controllers/teams");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//get the feed of all teams
router.get("/", ensureAuth, teamController.getTeams);

//get the profile of a specific team
router.get("/:id", ensureAuth, teamController.getTeam);

//create new team from the teams feed
router.post("/createTeam", upload.single("file"), teamController.createTeam);

//edit a team from the teams feed
router.put('/editTeams/:id', ensureAuth, upload.single("file"), teamController.editTeams)

//edit a team from the team profile
router.put('/editTeam/:id', ensureAuth, upload.single("file"), teamController.editTeam)

//pin a team from the teams feed
router.put('/togglePinnedFeed/:id', teamController.togglePinnedFeed);

//pin a team from the team profile
router.put('/togglePinned/:id', teamController.togglePinned);

//create new row on table
router.post('/createRow/:id', ensureAuth, teamController.createRow);

//edit row on table
router.put("/editRow/:id", ensureAuth, teamController.editRow);

//delete row on table
router.delete("/deleteRow/:id", ensureAuth, teamController.deleteRow);

// router.put("/createTable/:id", teamController.createTable);
router.delete("/deleteTeam/:id", ensureAuth, teamController.deleteTeam);

module.exports = router;
