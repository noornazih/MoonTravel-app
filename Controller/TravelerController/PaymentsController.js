// controller/PaymentsController.js
const { db } = require("../models/db.js");
const crypto = require("crypto");

// Encryption setup
const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(process.env.ENCRYPTION_SECRET || "default_secret", "salt", 32);

// Utility functions
const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedData: encrypted, iv: iv.toString("hex") };
};

const decrypt = (encryptedData, ivHex) => {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, "hex"));
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// POST /v1/payments → Make payment (includes payment method)
const MakePayment = (req, res) => {
  const { userId, bookingId, method, discountCode, amount } = req.body;

  if (!userId || !bookingId || !method || amount === undefined) {
    return res.status(400).json({ error: "Missing fields are required", status: 400 });
  }

  db.get(`SELECT * FROM Bookings WHERE bookingId = ?`, [bookingId], (err, booking) => {
    if (err) {
      return res.status(500).json({ error: "Error retrieving booking" });
    }
    if (!booking) {
      return res.status(404).json({ error: "Booking not found", status: 404 });
    }

    const applyOrProceed = (finalAmount, appliedCode) => {
      const insert = `INSERT INTO Payments (bookingId, userId, method, amount, discountCode, status) VALUES (?, ?, ?, ?, ?, 'confirmed')`;
      const params = [bookingId, userId, method, finalAmount, appliedCode || null];

      db.run(insert, params, function (err2) {
        if (err2) {
          return res.status(402).json({ error: "declined payment", status: 402 });
        }

        db.run(`UPDATE Bookings SET status = 'confirmed', paymentId = ? WHERE bookingId = ?`, [this.lastID, bookingId]);

        return res.status(201).json({
          message: "Payment successful",
          paymentId: this.lastID,
          bookingId,
          amount: finalAmount,
          discountCode: appliedCode || null
        });
      });
    };

    if (discountCode) {
      db.get(`SELECT * FROM Offers WHERE code = ?`, [discountCode], (err2, offer) => {
        if (err2) {
          return res.status(500).json({ error: "Error checking discount code" });
        }
        if (!offer) {
          return res.status(409).json({ error: "Discount code is invalid or has already expired", status: 409 });
        }
        const discountedAmount = amount - (amount * offer.discountPercent / 100);
        applyOrProceed(discountedAmount, discountCode);
      });
    } else {
      applyOrProceed(amount, null);
    }
  });
};

module.exports = { MakePayment };