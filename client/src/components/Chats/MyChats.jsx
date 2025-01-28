/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
import ErrorNotifier from "../ErrorNotifier";
import { getSender } from "../../config/ChatLogic";
import ChatLoading from "./ChatLoading";
import { useChatContext } from "../../context/ChatProvider";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [error, setError] = useState(null);

  const { selectedChat, setSelectedChat, user, chats, setChats } =
    useChatContext();
  const fetchChats = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5005/api/chat/fetch",
        config
      );
      setChats(data?.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load the chats.");
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(userInfo);
    fetchChats(userInfo?.token);
  }, [fetchAgain]);

  return (
    <div
      className={`${
        selectedChat ? "hidden md:flex" : "flex"
      } flex-col items-center p-3 bg-white w-full md:w-3/3 rounded-lg border-0 border-gray-300 `}>
      {/* Error Notification */}
      {error && (
        <ErrorNotifier
          message={error}
          duration={5000}
          onClose={() => setError(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between w-full pb-3 px-3 font-sans text-lg md:text-xl">
        <span>My Chats</span>
        <GroupChatModal>
          <button className="flex items-center px-3 py-2 bg-blue-500 text-white text-sm md:text-base rounded-lg hover:bg-blue-600">
            New Group Chat
          </button>
        </GroupChatModal>
      </div>

      {/* Chats List */}
      <div className="flex flex-col p-3 bg-gray-100 w-full h-full rounded-lg overflow-hidden">
        {chats.length > 0 ? (
          <div className="flex flex-col gap-2 overflow-y-auto">
            {chats?.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`flex flex-col p-2 cursor-pointer rounded-lg ${
                  selectedChat === chat
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200"
                }`}>
                <span className="font-medium">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </span>
                {chat.latestMessage && (
                  <span className="text-xs text-gray-600">
                    <strong>{chat.latestMessage.sender.name}:</strong>{" "}
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
