const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const indexController = require('../controllers/index');
// const postsController = require("../controllers/posts");
// const feedController = require('../controllers/feed');
const homeController = require('../controllers/home');
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Home 
router.get("/", ensureAuth, homeController.getHome);

router.post("/createPlayer", upload.single("file"), homeController.createPlayer);

router.post("/createTeam", homeController.createTeam);

router.post("/createLeague", homeController.createLeague);

// router.post("/createTeam", homeController.createTeam);

// router.post("/createLeague", postsController.createLeague);


module.exports = router;