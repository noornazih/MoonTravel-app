const db = require("../models/db.js");

// GET /v1/users → Retrieve all user accounts
const RetrieveAllUsers = (req, res) => {
  const query = `SELECT userId, username AS name, email, role, status FROM users`;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Error retrieving users" });
    if (!rows || rows.length === 0)
      return res.status(404).json({ error: "User does not exist", status: 404 });

    return res.status(200).json({
      message: "Users retrieved successfully",
      data: rows
    });
  });
};

// GET /v1/users/:id → Retrieve details of a specific user
const RetrieveUserById = (req, res) => {
  const id = Number(req.params.id);
  const query = `SELECT userId, username AS name, email, role, status FROM users WHERE userId = ?`;

  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json({ error: "Error retrieving user" });
    if (!row) return res.status(404).json({ error: "User does not exist", status: 404 });

    return res.status(200).json({
      message: "User retrieved successfully",
      data: row
    });
  });
};

// PUT /v1/users/:id → Update user details (username, email, role)
const UpdateUserById = (req, res) => {
  const id = Number(req.params.id);
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: "Invalid role specified", status: 400 });
  }

  const query = `UPDATE users SET username = ?, email = ?, role = ? WHERE userId = ?`;
  const params = [name, email, role, id];

  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: "Error updating user" });
    if (this.changes === 0)
      return res.status(404).json({ error: "User does not exist", status: 404 });

    return res.status(200).json({
      message: "User updated successfully!",
      userId: id
    });
  });
};

// PUT /v1/users/:id/activate → Reactivate a user account
const ActivateUserById = (req, res) => {
  const id = Number(req.params.id);
  const query = `UPDATE users SET status = 'active' WHERE userId = ?`;

  db.run(query, [id], function (err) {
    if (err) return res.status(500).json({ error: "Error activating user" });
    if (this.changes === 0)
      return res.status(409).json({ error: "Account status has not changed", status: 409 });

    return res.status(200).json({
      message: "User account reactivated",
      userId: id,
      status: "active"
    });
  });
};

// PUT /v1/users/:id/deactivate → Deactivate a user account
const DeactivateUserById = (req, res) => {
  const id = Number(req.params.id);
  const query = `UPDATE users SET status = 'deactivated' WHERE userId = ?`;

  db.run(query, [id], function (err) {
    if (err) return res.status(500).json({ error: "Error deactivating user" });
    if (this.changes === 0)
      return res.status(409).json({ error: "Account status has not changed", status: 409 });

    return res.status(200).json({
      message: "User account deactivated.",
      userId: id,
      status: "deactivated"
    });
  });
};

module.exports = {
  RetrieveAllUsers,
  RetrieveUserById,
  UpdateUserById,
  ActivateUserById,
  DeactivateUserById
};