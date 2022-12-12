const express = require('express');
const {isAuth, isAdmin} = require("../middleware/auth");
const {uploadTrailer, createMovie, updateMovieWithoutPoster, updateMovieWithPoster, removeMovie, getMovies,
    getMovieForUpdate, updateMovie, searchMovies, getLatestUploads, getSingleMovie, getRelatedMovies, getTopRatedMovies,
    searchPublicMovies, getMoviesByType, getHighestRatedMovies, filterMovies, getMovieByActor
} = require("../controllers/MovieController");
const {uploadVideo, uploadImage} = require("../middleware/multer");
const {parseData} = require("../utils/helper");
const {validateMovie, validate, validateTrailer} = require("../middleware/validator");
const router = express.Router();
const multer = require("multer");

router.post('/upload-trailer', isAuth, isAdmin, uploadVideo.single('video'), uploadTrailer);
router.post('/create', isAuth, isAdmin, uploadImage.single('poster'), parseData,
    validateMovie,
    validateTrailer,
    validate,
    createMovie);

// router.patch('/update-movie-without-poster/:movieId',
//     isAuth,
//     isAdmin,
//     // parseData,
//     validateMovie,
//     validate,
//     updateMovieWithoutPoster
// );

router.patch(
    "/update/:movieId",
    isAuth,
    isAdmin,
    uploadImage.single("poster"),
    parseData,
    validateMovie,
    validate,
    updateMovie,
);

router.delete('/:movieId', isAuth, isAdmin, removeMovie);
router.get('/movies', isAuth, isAdmin, getMovies);
router.get('/for-update/:movieId', isAuth, isAdmin, getMovieForUpdate);
router.get('/search', isAuth, isAdmin, searchMovies);

//user route
router.get("/latest-uploads", getLatestUploads);
router.get("/single/:movieId", getSingleMovie);
router.get("/related/:movieId", getRelatedMovies);
router.get("/top-rated", getTopRatedMovies);
router.get("/search-public", searchPublicMovies);
router.get('/movies-by-type', getMoviesByType);
router.get('/movies-filter', filterMovies);
router.get("/highest-rated", getHighestRatedMovies);
router.get('/movies-by-actor/:actorId', getMovieByActor);

module.exports = router;

