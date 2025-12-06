// controller/BookingsController.js
const { db } = require("../models/db.js");

// GET /v1/bookings/:userId → View booking history
const RetrieveBookingHistory = (req, res) => {
  const userId = Number(req.params.userId);
  const query = `SELECT * FROM Bookings WHERE userId = ?`;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error retrieving bookings" });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Booking not found", status: 404 });
    }
    return res.status(200).json({
      message: "Booking history retrieved successfully",
      data: rows
    });
  });
};

// PATCH /v1/bookings/:id/cancel → Cancel flight or hotel booking
const CancelBookingById = (req, res) => {
  const bookingId = Number(req.params.id);
  const query = `UPDATE Bookings SET status = 'cancelled' WHERE bookingId = ?`;

  db.run(query, [bookingId], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error cancelling booking" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Booking not found", status: 404 });
    }
    return res.status(200).json({
      message: "Booking cancelled",
      bookingId
    });
  });
};

module.exports = { RetrieveBookingHistory, CancelBookingById };