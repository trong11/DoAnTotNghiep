const { getAppInfo, getMostRated, getHighestRated, getMostReviewedUser} = require("../controllers/admin");
const { isAuth, isAdmin } = require("../middleware/auth");

const router = require("express").Router();

router.get("/app-info", isAuth, isAdmin, getAppInfo);
router.get("/most-rated", isAuth, isAdmin, getMostRated);
router.get("/most-review-user", isAuth, isAdmin, getMostReviewedUser);

module.exports = router;
