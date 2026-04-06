const db = require("../config/db");

// Add or Update Rating
exports.addOrUpdateRating = (req, res) => {
    const user_id = req.user.id;
    const { store_id, rating } = req.body;

    // Check if rating exists
    const checkQuery = "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?";

    db.query(checkQuery, [user_id, store_id], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length > 0) {
            // Update existing rating
            const updateQuery = "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?";

            db.query(updateQuery, [rating, user_id, store_id], (err) => {
                if (err) return res.status(500).json(err);

                return res.json({ message: "Rating updated ✅" });
            });
        } else {
            // Insert new rating
            const insertQuery = "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)";

            db.query(insertQuery, [user_id, store_id, rating], (err) => {
                if (err) return res.status(500).json(err);

                return res.json({ message: "Rating added ✅" });
            });
        }
    });
};