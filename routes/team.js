const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const teamController = require("../controllers/teams"); //changed from posts to original
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//get the feed of all teams
router.get("/", ensureAuth, teamController.getTeams);

//get the profile of a specific team
router.get("/:id", ensureAuth, teamController.getTeam);

//create new team from the teams feed
router.post("/createTeam", upload.single("file"), teamController.createTeam);

//edit a team from the teams feed
router.put('/editTeams/:id', teamController.editTeams)

//edit a team from the team profile
router.put('/editTeam/:id', teamController.editTeam)

//pin a team from the teams feed
router.put("/pinTeams/:id", teamController.pinTeams);

//pin a team from the team profile
router.put("/pinTeam/:id", teamController.pinTeam);

//pin a team from the team profile
router.put("/addToPinned/:id", teamController.addToPinned);

//create new row on table
router.post('/createRow/:id', teamController.createRow);

//edit row on table
router.put("/editRow/:id", teamController.editRow);

//delete row on table
router.delete("/deleteRow/:id", teamController.deleteRow);

// router.put("/createTable/:id", teamController.createTable);
router.delete("/deleteTeam/:id", teamController.deleteTeam);


module.exports = router;
