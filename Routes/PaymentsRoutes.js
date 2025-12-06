// routes/PaymentsRouter.js
const express = require("express");
const { MakePayment } = require("../Controller/TravelerController/PaymentsController");

const router = express.Router();

router.post("/v1/payments", MakePayment);

module.exports = router;