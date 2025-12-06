// routes/BookingsRouter.js
const express = require("express");
const { RetrieveBookingHistory, CancelBookingById } = require("../Controller/TravelerController/BookingsController");

const router = express.Router();

router.get("/v1/bookings/:userId", RetrieveBookingHistory);
router.patch("/v1/bookings/:id/cancel", CancelBookingById);

module.exports = router;