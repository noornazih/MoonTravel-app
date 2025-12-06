// controller/OffersController.js
const { db } = require("../models/db.js");

// GET /v1/offers → View promotional offers
const RetrieveAllOffers = (req, res) => {
  const query = `SELECT * FROM Offers`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error retrieving offers" });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No offers found", status: 404 });
    }
    return res.status(200).json({
      message: "Offers retrieved successfully",
      data: rows
    });
  });
};

// POST /v1/offers/apply → Enter discount code during booking
const ApplyDiscountCode = (req, res) => {
  const { bookingId, discountCode } = req.body;

  if (!bookingId || !discountCode) {
    return res.status(400).json({ error: "Missing fields are required", status: 400 });
  }

  db.get(`SELECT * FROM Offers WHERE code = ?`, [discountCode], (err, offer) => {
    if (err) {
      return res.status(500).json({ error: "Error checking discount code" });
    }
    if (!offer) {
      return res.status(409).json({ error: "Discount code is invalid or has already expired", status: 409 });
    }
    return res.status(200).json({
      message: "Discount code applied",
      bookingId,
      discountPercent: offer.discountPercent
    });
  });
};

module.exports = { RetrieveAllOffers, ApplyDiscountCode };