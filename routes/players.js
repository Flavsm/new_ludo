const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const playersController = require("../controllers/players"); //changed from posts to original
const { ensureAuth, ensureGuest } = require("../middleware/auth");


//get the feed of all players
router.get("/", ensureAuth, playersController.getPlayers);

//get the profile of specific player
router.get("/:id", ensureAuth, playersController.getPlayer);

//create a player from the players feed
router.post('/createPlayer', upload.single("file"), playersController.createPlayer);

//edit a player from the players feed
router.put('/editPlayers/:id', ensureAuth, upload.single("file"), playersController.editPlayers)

//edit a player from the player profile
router.put('/editPlayer/:id', ensureAuth, upload.single("file"), playersController.editPlayer)

//pin a team from the teams feed
router.put('/togglePinnedFeed/:id', playersController.togglePinnedFeed);

//pin a team from the team profile
router.put('/togglePinned/:id', playersController.togglePinned);

//create new row on table
router.post('/createRow/:id', playersController.createRow);

//edit row on table
router.put("/editRow/:id", playersController.editRow);

//delete row on table
router.delete("/deleteRow/:id", playersController.deleteRow);

//delete a player from the feed or player profile
router.delete("/deletePlayer/:id", playersController.deletePlayer);

// router.post("/createPlayer", upload.single("file"), postsController.createPlayer);

module.exports = router;