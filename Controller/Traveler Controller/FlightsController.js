// controller/FlightsController.js
const { db } = require("../models/db.js");

// GET /v1/flights/status → Search flight status
const RetrieveFlightStatus = (req, res) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ error: "Missing fields are required", status: 400 });
  }

  const query = `SELECT * FROM Flights WHERE origin = ? AND destination = ?`;
  const params = [origin, destination];

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error retrieving flight status" });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Booking not found", status: 404 });
    }
    return res.status(200).json({
      message: "Flight status retrieved successfully",
      data: rows
    });
  });
};

// GET /v1/filter flights → Search and filter flights
const FilterFlights = (req, res) => {
  const { budget, airline, departureDate } = req.query;

  let query = `SELECT * FROM Flights WHERE 1=1`;
  const params = [];

  if (budget) {
    query += ` AND price <= ?`;
    params.push(budget);
  }
  if (airline) {
    query += ` AND airline = ?`;
    params.push(airline);
  }
  if (departureDate) {
    query += ` AND departureDate = ?`;
    params.push(departureDate);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error filtering flights" });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Booking not found", status: 404 });
    }
    return res.status(200).json({
      message: "Flights filtered successfully",
      data: rows
    });
  });
};

module.exports = { RetrieveFlightStatus, FilterFlights };