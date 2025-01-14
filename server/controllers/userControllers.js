const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler");
const { ErrorResponse } = require("../utils/errorHandler");

/**
 * @desc    Register a new user
 * @route   POST /api/users/
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorResponse(400, "Please enter all required fields"));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorResponse(400, "User already exists"));
  }

  const user = await User.create({ name, email, password, pic });

  if (user) {
    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      },
    });
  } else {
    return next(new ErrorResponse(400, "Failed to register user"));
  }
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      statusCode: 200,
      status: "success",
      message: "User authenticated successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      },
    });
  } else {
    return next(new ErrorResponse(401, "Invalid email or password"));
  }
});

module.exports = { registerUser, authUser };
