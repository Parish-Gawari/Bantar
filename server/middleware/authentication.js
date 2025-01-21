const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { ErrorResponse } = require("../utils/errorHandler");

const verify = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new ErrorResponse(401, "Not authorized, no token provided"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return next(new ErrorResponse(401, "Unauthorized, user not found"));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse(401, "Unauthorized, invalid token"));
  }
});

module.exports = { verify };
