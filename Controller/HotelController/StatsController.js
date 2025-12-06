const { db } = require("../models/db.js");

// GET /v1/stats/bookings → View booking statistics
const RetrieveBookingStats = (req, res) => {
    const query = `SELECT hotelId, COUNT(*) AS totalBookings, 
                   ROUND((COUNT(*) * 100.0) / (SELECT COUNT(*) FROM Reservations), 2) AS occupancyRate
                   FROM Reservations GROUP BY hotelId`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving booking stats" });
        }
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No booking stats found", status: 404 });
        }
        return res.status(200).json({
            message: "Booking statistics retrieved successfully",
            data: rows
        });
    });
};

// GET /v1/stats/revenue → View revenue statistics
const RetrieveRevenueStats = (req, res) => {
    const query = `SELECT hotelId, SUM(amount) AS monthlyRevenue, 'EGP' AS currency
                   FROM Payments GROUP BY hotelId`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving revenue stats" });
        }
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No revenue stats found", status: 404 });
        }
        return res.status(200).json({
            message: "Revenue statistics retrieved successfully",
            data: rows
        });
    });
};

module.exports = { RetrieveBookingStats, RetrieveRevenueStats };