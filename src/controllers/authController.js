const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {

    const { name, email, password, address, role } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = "INSERT INTO USERS (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)";

    db.query(query, [name, email, hashedPassword, address, role || "user"], (err, result) => {
        if(err) {
            return res.status(500).json(err);
        }
        res.json({ message: "User Registered Successfully "});

    });
};

exports.login = (req, res) => {

    const { email, password } = req.body;

    const query = "SELECT * FROM USERS WHERE email = ?";

    db.query(query, [email], (err, result) => {
        if(err) {
            return req.status(500).json(err);
        }
        if(result.length === 0) {
            return res.status(400).json({ message: "User Not Found "});
        }

        const user = result[0];

        const isMatch = bcrypt.compareSync(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials"});
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            "SECRET_KEY",
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
        });
    });
};