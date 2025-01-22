const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");
const { verify } = require("../middleware/authentication");

const router = express.Router();

// Route to access or create a one-on-one chat
router.post("/access", verify, accessChat);

// Route to fetch all chats for the authenticated user
router.get("/fetch", verify, fetchChats);

// Route to create a new group chat
router.post("/group", verify, createGroupChat);

// Route to rename an existing group chat
router.put("/rename", verify, renameGroup);

// Route to remove a user from a group chat
router.put("/groupremove", verify, removeFromGroup);

// Route to add a user to a group chat
router.put("/groupadd", verify, addToGroup);

module.exports = router;
