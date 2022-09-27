const express = require("express");
const router = express.Router();
// const upload = require("../middleware/multer");
const teamController = require("../controllers/teams"); //changed from posts to original
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/", ensureAuth, teamController.getTeams);

router.get("/:id", ensureAuth, teamController.getTeam);

// router.post("/createPost", teamController.createPost);

router.put('/editTeam/:id', teamController.editTeam)

router.put("/pinTeam/:id", teamController.pinTeam);

// router.put("/createTable/:id", teamController.createTable);

router.delete("/deleteTeam/:id", teamController.deleteTeam);


module.exports = router;
