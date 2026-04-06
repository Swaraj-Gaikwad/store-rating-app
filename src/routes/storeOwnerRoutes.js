const express = require("express");
const router = express.Router();

const storeOwnerController = require("../controllers/storeOwnerController");
const { verifyToken, isStoreOwner } = require("../middleware/authMiddleware");

// Store Owner Dashboard
router.get("/dashboard", verifyToken, isStoreOwner, storeOwnerController.getDashboard);

module.exports = router;