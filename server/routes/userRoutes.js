const express = require("express");
const { registerUser, authUser } = require("../controllers/userControllers"); // Fixed authuser typo

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

module.exports = router;
