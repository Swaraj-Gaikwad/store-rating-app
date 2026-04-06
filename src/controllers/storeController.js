const db = require("../config/db");

// Add Store (Admin only)
exports.addStore = (req, res) => {
    const { name, email, address, owner_id } = req.body;

    const query = "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)";

    db.query(query, [name, email, address, owner_id || null], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Store added successfully ✅" });
    });
};

// Get All Stores
exports.getStores = (req, res) => {
    const query = "SELECT * FROM stores";

    db.query(query, (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
};

// Search Stores
exports.searchStores = (req, res) => {
    const { name, address } = req.query;

    let query = "SELECT * FROM stores WHERE 1=1";
    let params = [];

    if (name) {
        query += " AND name LIKE ?";
        params.push(`%${name}%`);
    }

    if (address) {
        query += " AND address LIKE ?";
        params.push(`%${address}%`);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
};
exports.deleteStore = (req, res) => {
        const { id } = req.params;

        const query = "DELETE FROM stores WHERE id = ?";

        db.query(query, [id], (err) => {
            if (err) return res.status(500).json(err);

            res.json({ message: "Store deleted successfully ✅" });
        });
};