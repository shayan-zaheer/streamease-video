const express = require("express");
const moviesController = require("../controllers/moviesController");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/search").get(authController.checkToken, moviesController.searchMovies);
router.route("/popular").get(authController.checkToken, moviesController.getPopularMovies);
router.route("/general").get(authController.checkToken, moviesController.getAllMovies);
router.route("/:id").get(moviesController.getMovieByID);
router.route("/add-favorite/:movieId").get(authController.checkToken, moviesController.addFavorite);

module.exports = router;