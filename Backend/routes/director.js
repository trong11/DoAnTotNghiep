const express = require('express');
const {uploadImage} = require("../middleware/multer");
const {actorInfoValidator, validate} = require("../middleware/validator");
const {isAuth, isAdmin} = require("../middleware/auth");
const {createDirector, updateDirector, removeDirector, searchDirector, getLatestDirectors, getSingleDirector,
    getDirectors
} = require("../controllers/director");
const {getActors} = require("../controllers/actor");
const router = express.Router();

router.post('/create', isAuth, isAdmin,uploadImage.single("avatar"), actorInfoValidator, validate, createDirector)
router.post('/update/:directorId',isAuth, isAdmin,uploadImage.single("avatar"), actorInfoValidator, validate, updateDirector)
router.delete('/:directorId',isAuth, isAdmin,removeDirector);
router.get('/search', isAuth, isAdmin,searchDirector);
router.get('/latest-uploads', isAuth, isAdmin,getLatestDirectors);
router.get('/directors', isAuth, isAdmin, getDirectors);
router.get("/single/:id", getSingleDirector);

module.exports = router;

