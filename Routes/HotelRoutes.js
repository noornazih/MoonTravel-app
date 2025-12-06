// routes/HotelsRouter.js
const express = require("express");
const {
  RetrieveHotelById,
  UpdateHotelDetails,
  UpdateRoomAvailability
} = require("../Controller/Traveler Controller/HotelsController");

const router = express.Router();

router.get("/v1/hotels/:id", RetrieveHotelById);
router.put("/v1/hotels/:id", UpdateHotelDetails);
router.put("/v1/hotels/:id/availability", UpdateRoomAvailability);

module.exports = router;