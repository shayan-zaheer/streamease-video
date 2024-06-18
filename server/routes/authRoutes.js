const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// router.route("/authenticate").get(authController.authenticate);
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

module.exports = router;