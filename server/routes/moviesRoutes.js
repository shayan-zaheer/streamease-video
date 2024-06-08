const express = require("express");
const moviesController = require("../controllers/moviesController");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/popular").get(authController.checkToken, moviesController.getPopularMovies);
router.route("/general").get(authController.checkToken, moviesController.getAllMovies);
router.route("/:id").get(authController.checkToken, moviesController.getMovieByID);
// router.route("/:query").get(moviesController.searchMovie);

module.exports = router;