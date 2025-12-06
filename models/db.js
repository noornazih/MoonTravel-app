const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create or connect to your SQLite database file
const dbPath = path.resolve(__dirname, "../travel.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database at", dbPath);
  }
});

// Traveler, Hotel Manager, Admin
const CreateUsersTable = `CREATE TABLE IF NOT EXISTS users (
    userId INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'active'
)`;

// Hotel listings
const CreateHotelsTable = `CREATE TABLE IF NOT EXISTS hotels (
    hotelId INTEGER PRIMARY KEY AUTOINCREMENT,
    hotelName TEXT NOT NULL,
    location TEXT NOT NULL,
    managerId INTEGER,
    pricePerNight REAL DEFAULT 0,
    roomsAvailable INTEGER DEFAULT 0,
    description TEXT,
    amenities TEXT,
    FOREIGN KEY(managerId) REFERENCES users(userId)
)`;

// Flight listings
const CreateFlightsTable = `CREATE TABLE IF NOT EXISTS flights (
    flightId INTEGER PRIMARY KEY AUTOINCREMENT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    airline TEXT,
    departureDate TEXT,
    price REAL DEFAULT 0,
    seatsAvailable INTEGER DEFAULT 0
)`;

// Bookings
const CreateBookingsTable = `CREATE TABLE IF NOT EXISTS bookings (
    bookingId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    hotelId INTEGER,
    flightId INTEGER,
    status TEXT DEFAULT 'pending',
    paymentId INTEGER,
    FOREIGN KEY(userId) REFERENCES users(userId),
    FOREIGN KEY(hotelId) REFERENCES hotels(hotelId),
    FOREIGN KEY(flightId) REFERENCES flights(flightId)
)`;

// Payments
const CreatePaymentsTable = `CREATE TABLE IF NOT EXISTS payments (
    paymentId INTEGER PRIMARY KEY AUTOINCREMENT,
    bookingId INTEGER,
    userId INTEGER,
    method TEXT,
    amount REAL,
    discountCode TEXT,
    status TEXT DEFAULT 'confirmed',
    cardEncrypted TEXT,
    iv TEXT,
    FOREIGN KEY(bookingId) REFERENCES bookings(bookingId),
    FOREIGN KEY(userId) REFERENCES users(userId)
)`;

// Offers
const CreateOffersTable = `CREATE TABLE IF NOT EXISTS offers (
    offerId INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    discountPercent INTEGER,
    expiryDate TEXT
)`;

// Reviews
const CreateReviewsTable = `CREATE TABLE IF NOT EXISTS reviews (
    reviewId INTEGER PRIMARY KEY AUTOINCREMENT,
    hotelId INTEGER,
    userId INTEGER,
    rating INTEGER,
    comment TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(hotelId) REFERENCES hotels(hotelId),
    FOREIGN KEY(userId) REFERENCES users(userId)
)`;

// Reservations
const CreateReservationsTable = `CREATE TABLE IF NOT EXISTS reservations (
    reservationId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    hotelId INTEGER,
    checkIn TEXT,
    checkOut TEXT,
    specialRequests TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(userId) REFERENCES users(userId),
    FOREIGN KEY(hotelId) REFERENCES hotels(hotelId)
)`;

// Authentication Logs
const CreateAuthLogsTable = `CREATE TABLE IF NOT EXISTS authLogs (
    logId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    event TEXT,
    ip TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(userId)
)`;

// Booking Statistics (view)
const CreateStatsView = `CREATE VIEW IF NOT EXISTS bookingStats AS
SELECT hotelId, COUNT(*) AS totalBookings
FROM reservations
GROUP BY hotelId`;

db.serialize(() => {
  db.run(CreateUsersTable);
  db.run(CreateHotelsTable);
  db.run(CreateFlightsTable);
  db.run(CreateBookingsTable);
  db.run(CreatePaymentsTable);
  db.run(CreateOffersTable);
  db.run(CreateReviewsTable);
  db.run(CreateReservationsTable);
  db.run(CreateAuthLogsTable);
  db.run(CreateStatsView);
});

module.exports = db;