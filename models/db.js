const sqlite = require('sqlite3');
const db = new sqlite.Database('travel.db');

// Traveler, Hotel Manager, Admin
const CreateUsersTable = `CREATE TABLE IF NOT EXISTS Users (
    userId INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'active'
)`;

// Hotel listings
const CreateHotelsTable = `CREATE TABLE IF NOT EXISTS Hotels (
    hotelId INTEGER PRIMARY KEY AUTOINCREMENT,
    hotelName TEXT NOT NULL,
    location TEXT NOT NULL,
    managerId INTEGER,
    pricePerNight REAL DEFAULT 0,
    roomsAvailable INTEGER DEFAULT 0,
    description TEXT,
    amenities TEXT,
    FOREIGN KEY(managerId) REFERENCES Users(userId)
)`;

// Flight listings
const CreateFlightsTable = `CREATE TABLE IF NOT EXISTS Flights (
    flightId INTEGER PRIMARY KEY AUTOINCREMENT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    airline TEXT,
    departureDate TEXT,
    price REAL DEFAULT 0,
    seatsAvailable INTEGER DEFAULT 0
)`;

// Bookings
const CreateBookingsTable = `CREATE TABLE IF NOT EXISTS Bookings (
    bookingId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    hotelId INTEGER,
    flightId INTEGER,
    status TEXT DEFAULT 'pending',
    paymentId INTEGER,
    FOREIGN KEY(userId) REFERENCES Users(userId),
    FOREIGN KEY(hotelId) REFERENCES Hotels(hotelId),
    FOREIGN KEY(flightId) REFERENCES Flights(flightId)
)`;

// Payments
const CreatePaymentsTable = `CREATE TABLE IF NOT EXISTS Payments (
    paymentId INTEGER PRIMARY KEY AUTOINCREMENT,
    bookingId INTEGER,
    userId INTEGER,
    method TEXT,
    amount REAL,
    discountCode TEXT,
    status TEXT DEFAULT 'confirmed',
    FOREIGN KEY(bookingId) REFERENCES Bookings(bookingId),
    FOREIGN KEY(userId) REFERENCES Users(userId)
)`;

// Offers
const CreateOffersTable = `CREATE TABLE IF NOT EXISTS Offers (
    offerId INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    discountPercent INTEGER,
    expiryDate TEXT
)`;

// Reviews
const CreateReviewsTable = `CREATE TABLE IF NOT EXISTS Reviews (
    reviewId INTEGER PRIMARY KEY AUTOINCREMENT,
    hotelId INTEGER,
    userId INTEGER,
    rating INTEGER,
    comment TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(hotelId) REFERENCES Hotels(hotelId),
    FOREIGN KEY(userId) REFERENCES Users(userId)
)`;

// Reservations
const CreateReservationsTable = `CREATE TABLE IF NOT EXISTS Reservations (
    reservationId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    hotelId INTEGER,
    checkIn TEXT,
    checkOut TEXT,
    specialRequests TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(userId) REFERENCES Users(userId),
    FOREIGN KEY(hotelId) REFERENCES Hotels(hotelId)
)`;

// Authentication Logs
const CreateAuthLogsTable = `CREATE TABLE IF NOT EXISTS AuthLogs (
    logId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    event TEXT,
    ip TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES Users(userId)
)`;

// Booking Statistics (optional view or query-based)
const CreateStatsView = `CREATE VIEW IF NOT EXISTS BookingStats AS
SELECT hotelId, COUNT(*) AS totalBookings
FROM Reservations
GROUP BY hotelId`;

module.exports = {
    db,
    CreateUsersTable,
    CreateHotelsTable,
    CreateFlightsTable,
    CreateBookingsTable,
    CreatePaymentsTable,
    CreateOffersTable,
    CreateReviewsTable,
    CreateReservationsTable,
    CreateAuthLogsTable,
    CreateStatsView
};