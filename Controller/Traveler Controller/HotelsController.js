// controller/HotelsController.js
const { db } = require("../models/db.js");

// GET /v1/hotels/:id → View hotel details
const RetrieveHotelById = (req, res) => {
  const id = Number(req.params.id);
  const query = `SELECT * FROM Hotels WHERE hotelId = ?`;

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Error retrieving hotel details" });
    }
    if (!row) {
      return res.status(404).json({ error: "Hotel not found", status: 404 });
    }
    return res.status(200).json({
      message: "Hotel details retrieved successfully",
      data: row
    });
  });
};

// PUT /v1/hotels/:id → Add or update hotel pricing and details
const UpdateHotelDetails = (req, res) => {
  const id = Number(req.params.id);
  const { ThepricePerNight, description, serviceProvided } = req.body;

  if (!ThepricePerNight || !description) {
    return res.status(400).json({ error: "Missing fields are required", status: 400 });
  }

  const query = `UPDATE Hotels SET pricePerNight = ?, description = ?, amenities = ? WHERE hotelId = ?`;
  const params = [ThepricePerNight, description, JSON.stringify(serviceProvided || []), id];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: "Error updating hotel details" });
    }
    if (this.changes === 0) {
      return res.status(409).json({ error: "no recent changes detected", status: 409 });
    }
    return res.status(200).json({
      message: "Hotel details updated",
      hotelId: id
    });
  });
};

// PUT /v1/hotels/:id/availability → Update room availability
const UpdateRoomAvailability = (req, res) => {
  const id = Number(req.params.id);
  const { roomsAvailable } = req.body;

  if (roomsAvailable === undefined) {
    return res.status(400).json({ error: "Missing fields are required", status: 400 });
  }

  const query = `UPDATE Hotels SET roomsAvailable = ? WHERE hotelId = ?`;
  const params = [roomsAvailable, id];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: "Error updating availability" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Hotel not found", status: 404 });
    }
    return res.status(200).json({
      message: "Available rooms updated!",
      hotelId: id,
      roomsAvailable
    });
  });
};

module.exports = { RetrieveHotelById, UpdateHotelDetails, UpdateRoomAvailability };