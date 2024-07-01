const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").post(authController.logout);
router.route("/update-password").patch(authController.updatePassword);
router.route("/forgot-password").patch(authController.forgotPassword);
router.route("/reset-password").patch(authController.resetPassword);

module.exports = router;