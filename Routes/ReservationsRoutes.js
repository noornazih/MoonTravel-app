const express = require("express");
const { 
    RetrieveAllReservations, 
    ValidateReservationById, 
    UpdateReservationStatus 
} = require("../controller/HotelController/ReservationsController");

const router = express.Router();

// Hotel Manager: manage reservations
router.get("/v1/reservations", RetrieveAllReservations);              // View incoming reservation requests
router.put("/v1/reservations/:id/validate", ValidateReservationById);// Validate availability for booking
router.put("/v1/reservations/:id/status", UpdateReservationStatus);  // Accept or reject reservation

module.exports = router;