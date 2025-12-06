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
const TripRouter = require("./routes/TripRouter");
const UserRouter = require("./routes/UserRouter");
const AuthRouter = require("./routes/AuthRouter");
const HotelRouter = require("./routes/HotelRouter");
const TravelerRouter = require("./routes/TravelerRouter");
const BookingsRouter = require("./routes/BookingsRouter");
const PaymentsRouter = require("./routes/PaymentsRouter");
const OffersRouter = require("./routes/OffersRouter");
const ReviewsRouter = require("./routes/ReviewsRouter");
const FlightsRouter = require("./routes/FlightsRouter");
const ReservationsRouter = require("./routes/ReservationsRouter");

// Route mounting
app.use("/trips", TripRouter);
app.use("/users", UserRouter);
app.use("/auth", AuthRouter);
app.use("/hotels", HotelRouter);
app.use("/travelers", TravelerRouter);
app.use("/bookings", BookingsRouter);
app.use("/payments", PaymentsRouter);
app.use("/offers", OffersRouter);
app.use("/reviews", ReviewsRouter);
app.use("/flights", FlightsRouter);
app.use("/reservations", ReservationsRouter);

module.exports = { app };