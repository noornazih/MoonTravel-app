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
const UserRoutes = require("./Routes/UserRoutes.js");
const AuthRoutes = require("./Routes/AuthRoutes.js");
const HotelRoutes = require("./Routes/HotelRoutes.js");
const BookingsRoutes = require("./Routes/BookingsRoutes.js");
const PaymentsRoutes = require("./Routes/PaymentsRoutes.js");
const OffersRoutes = require("./Routes/OffersRoutes.js");
const ReviewsRoutes = require("./Routes/ReviewsRoutes.js");
const FlightsRoutes = require("./Routes/FlightsRoutes.js");
const ReservationsRoutes = require("./Routes/ReservationsRoutes.js");

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