const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { ErrorResponse } = require("../utils/errorHandler");

/**
 * @desc    Access or create a one-on-one chat
 * @route   POST /api/chat/access
 * @access  Private
 */
const accessChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return next(new ErrorResponse(400, "User ID is required"));
  }

  try {
    // Check if a chat already exists between the two users
    let chat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (chat.length > 0) {
      return res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Chat retrieved successfully",
        data: chat[0],
      });
    }

    // If no chat exists, create a new chat
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Chat created successfully",
      data: fullChat,
    });
  } catch (error) {
    return next(new ErrorResponse(500, "Failed to access or create chat"));
  }
});

/**
 * @desc    Fetch all chats for a user
 * @route   GET /api/chat/
 * @access  Private
 */
const fetchChats = asyncHandler(async (req, res, next) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const populatedChats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Chats fetched successfully",
      data: populatedChats,
    });
  } catch (error) {
    return next(new ErrorResponse(500, "Failed to fetch chats"));
  }
});

/**
 * @desc    Create a new group chat
 * @route   POST /api/chat/group
 * @access  Private
 */
const createGroupChat = asyncHandler(async (req, res, next) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return next(new ErrorResponse(400, "Please provide all required fields"));
  }

  const parsedUsers = JSON.parse(users);

  if (parsedUsers.length < 2) {
    return next(
      new ErrorResponse(
        400,
        "At least 2 users are required to form a group chat"
      )
    );
  }

  parsedUsers.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Group chat created successfully",
      data: fullGroupChat,
    });
  } catch (error) {
    return next(new ErrorResponse(500, "Failed to create group chat"));
  }
});

/**
 * @desc    Rename a group chat
 * @route   PUT /api/chat/rename
 * @access  Private
 */
const renameGroup = asyncHandler(async (req, res, next) => {
  const { chatId, chatName } = req.body;

  if (!chatId || !chatName) {
    return next(
      new ErrorResponse(400, "Chat ID and new chat name are required")
    );
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return next(new ErrorResponse(404, "Chat not found"));
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Group chat renamed successfully",
      data: updatedChat,
    });
  } catch (error) {
    return next(new ErrorResponse(500, "Failed to rename group chat"));
  }
});

/**
 * @desc    Remove a user from a group chat
 * @route   PUT /api/chat/groupremove
 * @access  Private
 */
const removeFromGroup = asyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return next(new ErrorResponse(400, "Chat ID and user ID are required"));
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return next(new ErrorResponse(404, "Chat not found"));
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "User removed from group chat successfully",
      data: updatedChat,
    });
  } catch (error) {
    return next(
      new ErrorResponse(500, "Failed to remove user from group chat")
    );
  }
});

/**
 * @desc    Add a user to a group chat
 * @route   PUT /api/chat/groupadd
 * @access  Private
 */
const addToGroup = asyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return next(new ErrorResponse(400, "Chat ID and user ID are required"));
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return next(new ErrorResponse(404, "Chat not found"));
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "User added to group chat successfully",
      data: updatedChat,
    });
  } catch (error) {
    return next(new ErrorResponse(500, "Failed to add user to group chat"));
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
