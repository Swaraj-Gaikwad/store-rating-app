const db = require("../config/db");

// Get Store Owner Dashboard
exports.getDashboard = (req, res) => {
    const owner_id = req.user.id;

    // Get store of this owner
    const storeQuery = "SELECT * FROM stores WHERE owner_id = ?";

    db.query(storeQuery, [owner_id], (err, stores) => {
        if (err) return res.status(500).json(err);

        if (stores.length === 0) {
            return res.json({ message: "No store found for this owner" });
        }

        const store = stores[0];

        // Get ratings + users
        const ratingQuery = `
      SELECT users.name, users.email, ratings.rating
      FROM ratings
      JOIN users ON ratings.user_id = users.id
      WHERE ratings.store_id = ?
    `;

        db.query(ratingQuery, [store.id], (err, ratings) => {
            if (err) return res.status(500).json(err);

            // Calculate average
            const avgQuery = "SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = ?";

            db.query(avgQuery, [store.id], (err, avgResult) => {
                if (err) return res.status(500).json(err);

                res.json({
                    store: store.name,
                    average_rating: avgResult[0].average_rating || 0,
                    ratings: ratings
                });
            });
        });
    });
};