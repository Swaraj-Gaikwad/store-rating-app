const express = require("express");
const router = express.Router();

const ratingController = require("../controllers/ratingController");
const { verifyToken, isUser } = require("../middleware/authMiddleware");

// Only normal users can rate
router.post("/", verifyToken, isUser, ratingController.addOrUpdateRating);

module.exports = router;