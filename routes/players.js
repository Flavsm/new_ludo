const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const playersController = require("../controllers/players"); //changed from posts to original
const { ensureAuth, ensureGuest } = require("../middleware/auth");



router.get("/", ensureAuth, playersController.getPlayers);

router.post('/createPost/', upload.single("file"), playersController.createPost);

router.put('/editPlayer/:id', playersController.editPlayer)

router.delete("/deletePost/:id", playersController.deletePost);


module.exports = router;