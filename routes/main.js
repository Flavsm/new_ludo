const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const indexController = require('../controllers/index');
const postsController = require("../controllers/posts");
const feedController = require('../controllers/feed');
const homeController = require('../controllers/home');
/* const js = require('../public/js/index') */
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes 
router.get("/", indexController.getIndex);

//Login and Signup
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

//Home 
router.get("/home", ensureAuth, homeController.getHome);

module.exports = router;
