// routes/PaymentsRouter.js
const express = require("express");
const { MakePayment } = require("../controller/TravelerController/PaymentsController");

const router = express.Router();

router.post("/v1/payments", MakePayment);

module.exports = router;