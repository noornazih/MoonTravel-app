// routes/UserRouter.js
const express = require("express");
const {
  RetrieveAllUsers,
  RetrieveUserById,
  UpdateUserById,
  ActivateUserById,
  DeactivateUserById
} = require("../controller/UserController");

const router = express.Router();

router.get("/v1/users", RetrieveAllUsers);
router.get("/v1/users/:id", RetrieveUserById);
router.put("/v1/users/:id", UpdateUserById);
router.put("/v1/users/:id/activate", ActivateUserById);
router.put("/v1/users/:id/deactivate", DeactivateUserById);

module.exports = router;