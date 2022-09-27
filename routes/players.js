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
router.put('/editPlayers/:id', playersController.editPlayers)

//edit a player from the player profile
router.put('/editPlayer/:id', playersController.editPlayer)

//pin a player from the player profile
router.put("/pinPlayer/:id", playersController.pinPlayer);

//delete a player from the feed or player profile
router.delete("/deletePlayer/:id", playersController.deletePlayer);

// router.post("/createPlayer", upload.single("file"), postsController.createPlayer);

// router.post("/createTeam", postsController.createTeam);

// router.post("/createLeague", postsController.createLeague);

// router.put("/createTable/:id", postsController.createTable);



module.exports = router;