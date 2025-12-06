// routes/FlightsRouter.js
const express = require("express");
const { RetrieveFlightStatus, FilterFlights } = require("../controller/TravelerController/FlightsController");

const router = express.Router();

router.get("/v1/flights/status", RetrieveFlightStatus);
router.get("/v1/flights/filter", FilterFlights);

module.exports = router;