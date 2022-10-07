const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const indexController = require('../controllers/index');
const homeController = require('../controllers/home');
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Home 
router.get("/", ensureAuth, homeController.getHome);

router.post("/createPlayer", upload.single("file"), homeController.createPlayer);

router.post("/createTeam", upload.single("file"), homeController.createTeam);

router.post("/createLeague", upload.single("file"), homeController.createLeague);


module.exports = router;