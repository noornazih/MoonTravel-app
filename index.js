// index.js
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Middleware
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

// Routers
const UserRoutes = require("./routes/UserRoutes.js");
const AuthRoutes = require("./routes/AuthRoutes.js");
const HotelRoutes = require("./routes/HotelRoutes.js");
const BookingsRoutes = require("./routes/BookingsRoutes.js");
const PaymentsRoutes = require("./routes/PaymentsRoutes.js");
const OffersRoutes = require("./routes/OffersRoutes.js");
const ReviewsRoutes = require("./routes/ReviewsRoutes.js");
const FlightsRoutes = require("./routes/FlightsRoutes.js");
const ReservationsRoutes = require("./routes/ReservationsRoutes.js");

// Route mounting
app.use("/users", UserRoutes);
app.use("/auth", AuthRoutes);
app.use("/hotels", HotelRoutes);
app.use("/bookings", BookingsRoutes);
app.use("/payments", PaymentsRoutes);
app.use("/offers", OffersRoutes);
app.use("/reviews", ReviewsRoutes);
app.use("/flights", FlightsRoutes);
app.use("/reservations", ReservationsRoutes);

module.exports = { app };