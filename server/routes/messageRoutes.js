const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { verify } = require("../middleware/authentication");

const router = express.Router();

// Route to fetch all messages for a specific chat
router.get("/:chatId", verify, allMessages);

// Route to send a new message in a chat
router.post("/", verify, sendMessage);

module.exports = router;
