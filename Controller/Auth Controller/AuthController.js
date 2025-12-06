const { db } = require('../models/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

// POST /v1/signup
const signup = (req, res) => {
    const { username, email, password, role, hotelName, location } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ error: "Missing required fields", status: 400 });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error hashing password" });
        }

        // Traveler or Admin
        if (role === 'traveler' || role === 'admin') {
            const query = `INSERT INTO Users (name, email, passwordHash, role, status) VALUES (?, ?, ?, ?, 'active')`;
            const params = [username, email, hashedPassword, role];

            db.run(query, params, function (err) {
                if (err) {
                    console.log(err);
                    if (err.message.includes("UNIQUE constraint failed")) {
                        return res.status(409).json({ error: "Email already exists", status: 409 });
                    }
                    return res.status(500).json({ error: "Error creating user" });
                }

                const message = role === 'admin' ? "Admin account created internally" : "User registered successfully!";
                return res.status(201).json({ message, userId: this.lastID, role });
            });
        }

        // Hotel Manager
        else if (role === 'hotel_manager') {
            if (!hotelName || !location) {
                return res.status(400).json({ error: "Hotel name and location required", status: 400 });
            }

            db.run(
                `INSERT INTO Users (name, email, passwordHash, role, status) VALUES (?, ?, ?, 'hotel_manager', 'active')`,
                [username, email, hashedPassword],
                function (err) {
                    if (err) {
                        console.log(err);
                        if (err.message.includes("UNIQUE constraint failed")) {
                            return res.status(409).json({ error: "Email already exists", status: 409 });
                        }
                        return res.status(500).json({ error: "Error creating hotel manager" });
                    }

                    const userId = this.lastID;
                    db.run(
                        `INSERT INTO Hotels (hotelName, location, managerId, roomsAvailable, pricePerNight) VALUES (?, ?, ?, 0, 0)`,
                        [hotelName, location, userId],
                        function (err2) {
                            if (err2) {
                                console.log(err2);
                                return res.status(500).json({ error: "Error creating hotel record" });
                            }

                            return res.status(201).json({
                                message: "Hotel Manager created",
                                userId,
                                role: "hotel_manager",
                                hotelId: this.lastID
                            });
                        }
                    );
                }
            );
        }

        else {
            return res.status(400).json({ error: "Invalid role specified", status: 400 });
        }
    });
};

// POST /v1/login
const login = (req, res) => {
    const { email, password, remember } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required", status: 400 });
    }

    const query = `SELECT * FROM Users WHERE email = ?`;

    db.get(query, [email], (err, row) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error retrieving user" });
        }
        if (!row) {
            return res.status(401).json({ error: "Invalid credentials", status: 401 });
        }

        bcrypt.compare(password, row.passwordHash, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Error comparing passwords" });
            }
            if (!result) {
                return res.status(401).json({ error: "Invalid credentials", status: 401 });
            }

            const token = signToken(row.userId, row.role);

            // Set cookies as per CW report
            res.cookie('session_cookie', `session_${row.userId}`, {
                httpOnly: true,
                sameSite: 'Strict',
                secure: true,
                maxAge: 15 * 60 * 1000
            });

            res.cookie('auth_cookie', `auth_secure_${row.userId}`, {
                httpOnly: true,
                sameSite: 'Strict',
                secure: true,
                maxAge: 15 * 60 * 1000
            });

            if (remember) {
                res.cookie('persistent_cookie', `remember_me=true`, {
                    httpOnly: true,
                    sameSite: 'Strict',
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
            }

            return res.status(200).json({
                token,
                role: row.role,
                cookies: {
                    session_cookie: `session_${row.userId}`,
                    auth_cookie: `auth_secure_${row.userId}`,
                    persistent_cookie: remember ? "remember_me=true" : null
                }
            });
        });
    });
};

// POST /v1/logout
const logout = (req, res) => {
    res.clearCookie('session_cookie');
    res.clearCookie('auth_cookie');
    res.clearCookie('persistent_cookie');
    return res.json({ message: "Logged out successfully!" });
};

module.exports = { signup, login, logout };