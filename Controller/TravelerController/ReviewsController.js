// controller/ReviewsController.js
const { db } = require("../models/db.js");

// GET /v1/reviews/:hotelId → View guest reviews
const RetrieveReviewsByHotelId = (req, res) => {
  const hotelId = Number(req.params.hotelId);
  const query = `SELECT r.reviewId, r.rating, r.comment, r.createdAt, u.name AS reviewer
                 FROM Reviews r
                 JOIN Users u ON r.userId = u.userId
                 WHERE r.hotelId = ?`;

  db.all(query, [hotelId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error retrieving reviews" });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No reviews found", status: 404 });
    }
    return res.status(200).json({
      message: "Reviews retrieved successfully",
      data: rows
    });
  });
};

module.exports = { RetrieveReviewsByHotelId };