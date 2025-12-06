const { db } = require("../models/db.js");

// GET /v1/reservations → View incoming reservation requests
const RetrieveAllReservations = (req, res) => {
    const query = `SELECT * FROM Reservations`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving reservations" });
        }
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No reservations found", status: 404 });
        }
        return res.status(200).json({
            message: "Reservations retrieved successfully",
            data: rows
        });
    });
};

// PUT /v1/reservations/:id/validate → Validate availability for booking
const ValidateReservationById = (req, res) => {
    const reservationId = Number(req.params.id);
    const { status } = req.body;

    if (!status || status !== "validated") {
        return res.status(400).json({ error: "Invalid reservation status", status: 400 });
    }

    const query = `UPDATE Reservations SET status=? WHERE reservationId=?`;
    const params = [status, reservationId];

    db.run(query, params, function (err) {
        if (err) {
            return res.status(500).json({ error: "Error validating reservation" });
        }
        if (this.changes === 0) {
            return res.status(400).json({ error: "Invalid reservation id", status: 400 });
        }
        return res.status(200).json({
            message: "Availability confirmed",
            reservationId
        });
    });
};

// PUT /v1/reservations/:id/status → Accept or reject reservation
const UpdateReservationStatus = (req, res) => {
    const reservationId = Number(req.params.id);
    const { status } = req.body;

    if (!status || (status !== "accepted" && status !== "rejected")) {
        return res.status(400).json({ error: "Invalid reservation status", status: 400 });
    }

    const query = `UPDATE Reservations SET status=? WHERE reservationId=?`;
    const params = [status, reservationId];

    db.run(query, params, function (err) {
        if (err) {
            return res.status(500).json({ error: "Error updating reservation status" });
        }
        if (this.changes === 0) {
            return res.status(400).json({ error: "Invalid reservation id", status: 400 });
        }
        return res.status(200).json({
            message: `Reservation ${status}`,
            reservationId
        });
    });
};

module.exports = { RetrieveAllReservations, ValidateReservationById, UpdateReservationStatus };