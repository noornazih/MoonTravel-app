// routes/ReviewsRouter.js
const express = require("express");
const { RetrieveReviewsByHotelId } = require("../Controller/TravelerController/ReviewsController");

const router = express.Router();

router.get("/v1/reviews/:hotelId", RetrieveReviewsByHotelId);

module.exports = router;