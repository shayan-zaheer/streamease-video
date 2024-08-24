const express = require("express");
const moviesController = require("../controllers/moviesController");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/search").get(authController.checkToken, moviesController.searchMovies);
router.route("/popular").get(moviesController.getPopularMovies);
router.route("/general").get(moviesController.getAllMovies);
router.route("/favorites").get(authController.checkToken, moviesController.getFavorites);
router.route("/moviedata/:movieId").get(authController.checkToken, moviesController.getMovieData);
router.route("/remove-favorite/:movieId").get(authController.checkToken, moviesController.removeFavorite);
router.route("/:id").get(moviesController.getMovieByID);
router.route("/add-favorite/:movieId").get(authController.checkToken, moviesController.addFavorite);

module.exports = router;