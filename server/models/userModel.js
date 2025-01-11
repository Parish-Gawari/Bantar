const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: "String", requied: true },
    email: { type: "String", required: true },
    password: {
      type: "String",
      required: true,
    },
    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.Model("User", userSchema);
module.exports = User;
