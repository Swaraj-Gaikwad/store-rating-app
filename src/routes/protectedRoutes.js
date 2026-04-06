const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Protected route
router.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Welcome Admin 🎉" });
});

module.exports = router;