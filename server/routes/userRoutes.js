const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/update-password").patch(userController.updatePassword);
router.route("/update-me").patch(userController.updateMe);
router.route("/userdata").get(userController.getUser);

module.exports = router;