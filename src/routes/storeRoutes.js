const express = require("express");
const router = express.Router();

const storeController = require("../controllers/storeController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Admin adds store
router.post("/", verifyToken, isAdmin, storeController.addStore);

// Get all stores (any logged-in user)
router.get("/", verifyToken, storeController.getStores);

// Search stores
router.get("/search", verifyToken, storeController.searchStores);

router.delete("/:id", verifyToken, isAdmin, storeController.deleteStore);

module.exports = router;