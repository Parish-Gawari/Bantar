const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { ErrorResponse } = require("../utils/errorHandler");

/**
 * @desc    Get all messages for a specific chat
 * @route   GET /api/message/:chatId
 * @access  Private
 */
const allMessages = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    next(new ErrorResponse(500, "Failed to fetch messages"));
  }
});

/**
 * @desc    Send a new message in a chat
 * @route   POST /api/message
 * @access  Private
 */
const sendMessage = asyncHandler(async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return next(new ErrorResponse(400, "Content and chat ID are required"));
  }

  const newMessageData = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    // Create the message
    let message = await Message.create(newMessageData);

    // Retrieve the created message as a full Mongoose document
    message = await Message.findById(message._id)
      .populate("sender", "name pic")
      .populate("chat")
      .populate({
        path: "chat.users",
        select: "name pic email",
      });

    // Update the latest message in the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse(500, "Failed to send message"));
  }
});

module.exports = { allMessages, sendMessage };
