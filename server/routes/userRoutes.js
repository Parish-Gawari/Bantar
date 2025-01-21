const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { verify } = require("../middleware/authentication");

const router = express.Router();

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
router.post("/login", authUser);

/**
 * @desc    Get all users excluding the current user
 * @route   GET /api/users/allUser
 * @access  Private
 */
router.get("/allUser", verify, allUsers);

module.exports = router;
