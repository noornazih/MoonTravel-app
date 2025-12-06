// server.js
const { app } = require("./index");
const PORT = process.env.PORT || 5000;
const db_access = require("./models/db.js");
const db = db_access.db;

// Initialize all required tables for the application
db.serialize(() => {
  db.run(db_access.CreateUsersTable, (err) => {
    if (err) console.log("Error creating Users table:", err.message);
  });

  db.run(db_access.CreateHotelsTable, (err) => {
    if (err) console.log("Error creating Hotels table:", err.message);
  });

  db.run(db_access.CreateFlightsTable, (err) => {
    if (err) console.log("Error creating Flights table:", err.message);
  });

  db.run(db_access.CreateBookingsTable, (err) => {
    if (err) console.log("Error creating Bookings table:", err.message);
  });

  db.run(db_access.CreatePaymentsTable, (err) => {
    if (err) console.log("Error creating Payments table:", err.message);
  });

  db.run(db_access.CreateOffersTable, (err) => {
    if (err) console.log("Error creating Offers table:", err.message);
  });

  db.run(db_access.CreateReviewsTable, (err) => {
    if (err) console.log("Error creating Reviews table:", err.message);
  });

  db.run(db_access.CreateReservationsTable, (err) => {
    if (err) console.log("Error creating Reservations table:", err.message);
  });

  db.run(db_access.CreateAuthLogsTable, (err) => {
    if (err) console.log("Error creating AuthLogs table:", err.message);
  });

  db.run(db_access.CreateStatsView, (err) => {
    if (err) console.log("Error creating BookingStats view:", err.message);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`MoonTravel backend is running securely on port ${PORT}`);
});