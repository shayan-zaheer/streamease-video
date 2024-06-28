const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/update-password").patch(userController.updatePassword);
router.route("/update-me").patch(userController.updateMe);

module.exports = router;