const express = require("express");

// ✅ Fix: match actual folder name with space
const {
  RetrieveAllUsers,
  RetrieveUserById,
  UpdateUserById,
  ActivateUserById,
  DeactivateUserById
} = require("../controller/UserController/UserManagementController.js");

// ✅ Fix: match actual filename and folder
const { authorizeRole } = require("../middleware/Rolemiddleware.js");

const router = express.Router();

// ✅ Admin-only access
router.get("/v1/users", authorizeRole(["admin"]), RetrieveAllUsers);
router.get("/v1/users/:id", authorizeRole(["admin"]), RetrieveUserById);
router.put("/v1/users/:id", authorizeRole(["admin"]), UpdateUserById);
router.put("/v1/users/:id/activate", authorizeRole(["admin"]), ActivateUserById);
router.put("/v1/users/:id/deactivate", authorizeRole(["admin"]), DeactivateUserById);

module.exports = router;