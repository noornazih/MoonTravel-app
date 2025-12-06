const express = require("express");
const { RetrieveBookingStats, RetrieveRevenueStats } = require("../Controller/HotelController/StatsController");

const router = express.Router();

// Hotel Manager: view statistics
router.get("/v1/stats/bookings", RetrieveBookingStats); // View booking statistics
router.get("/v1/stats/revenue", RetrieveRevenueStats);  // View revenue statistics

module.exports = router;