// routes/OffersRouter.js
const express = require("express");
const { RetrieveAllOffers, ApplyDiscountCode } = require("../Controller/Traveler Controller/OffersController");

const router = express.Router();

router.get("/v1/offers", RetrieveAllOffers);
router.post("/v1/offers/apply", ApplyDiscountCode);

module.exports = router;