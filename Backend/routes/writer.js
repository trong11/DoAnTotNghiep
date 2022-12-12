const express = require('express');
const {uploadImage} = require("../middleware/multer");
const {actorInfoValidator, validate} = require("../middleware/validator");
const {isAuth, isAdmin} = require("../middleware/auth");
const {
    createWriter,
    updateWriter,
    removeWriter,
    searchWriter,
    getLatestWriters,
    getWriters,
    getSingleWriter
} = require("../controllers/writer");
const router = express.Router();

router.post('/create', isAuth, isAdmin, uploadImage.single("avatar"), actorInfoValidator, validate, createWriter)
router.post('/update/:writerId', isAuth, isAdmin, uploadImage.single("avatar"), actorInfoValidator, validate, updateWriter)
router.delete('/:writerId', isAuth, isAdmin, removeWriter);
router.get('/search', isAuth, isAdmin, searchWriter);
router.get('/latest-uploads', isAuth, isAdmin, getLatestWriters);
router.get('/writers', isAuth, isAdmin, getWriters);
router.get("/single/:id", getSingleWriter);

module.exports = router;

