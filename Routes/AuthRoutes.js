const express = require("express");
const { signup, login, logout } = require("../Controller/AuthController/AuthController");

const router = express.Router();

// Authentication endpoints
router.post("/v1/signup", signup);   // Register a new user (Traveler, Hotel Manager, Admin)
router.post("/v1/login", login);     // Authenticate user credentials and start session
router.post("/v1/logout", logout);   // End user session and clear cookies

module.exports = router;