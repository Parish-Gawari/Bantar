/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Lottie from "lottie-react";
import animationData from "../../misc/typing.json";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import ProfileModal from "../ProfileModal";
import UpdateGroupChatModal from "../Chats/UpdateGroupChatModel";
import { useChatContext } from "../../context/ChatProvider";

const ENDPOINT = "http://localhost:5005";
let socket, selectedChatCompare;

const SingleChat = ({
  fetchAgain,
  setFetchAgain,
  notification,
  setNotification,
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { selectedChat, setSelectedChat, user } = useChatContext();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5005/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:5005/api/message",
          { content: newMessage, chatId: selectedChat },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col h-full w-full border-0">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-200 rounded-t-lg">
            <button
              className="px-3 py-1 text-sm text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setSelectedChat(null)}>
              Back
            </button>
            {messages &&
              (!selectedChat.isGroupChat ? (
                <div className="flex items-center space-x-2">
                  <span>{getSender(user, selectedChat.users)}</span>
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="text-blue-600 hover:underline">
                    View Profile
                  </button>
                  {isProfileModalOpen && (
                    <ProfileModal
                      user={getSenderFull(user, selectedChat.users)}
                      onClose={() => setIsProfileModalOpen(false)}
                    />
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{selectedChat.chatName.toUpperCase()}</span>
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </div>
              ))}
          </div>

          {/* Chat Body */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-100 rounded-b-lg">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 border-4 border-gray-300 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="messages">
                {/* <ScrollableChat messages={messages} /> */}
              </div>
            )}
          </div>

          {/* Typing Indicator and Message Input */}
          <div className="p-4 bg-gray-200">
            {isTyping && (
              <div className="mb-2">
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                  style={{ height: "50px", width: "70px" }}
                />
              </div>
            )}
            <input
              type="text"
              placeholder="Enter a message..."
              value={newMessage}
              onChange={typingHandler}
              onKeyDown={sendMessage}
              className="w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl font-semibold">
            Click on a user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
