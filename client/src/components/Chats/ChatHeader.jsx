/* eslint-disable no-unused-vars */
import { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useChatContext } from "../../context/ChatProvider";
import axios from "axios";
import ErrorNotifier from "../../misc/ErrorNotifier";
import SearchDrawer from "./SearchDrawer";
import ProfileModal from "../Modals/ProfileModal";

const ChatHeader = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenBell, setIsDropdownOpenBell] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const {
    user,
    notification,
    setNotification,
    setSelectedChat,
    chats,
    setChats,
  } = useChatContext();

  const accessChat = async (chat) => {
    try {
      setLoadingChat(true);
      setSelectedChat(chat);
      setNotification(notification.filter((n) => n.chat._id !== chat._id));
      setLoadingChat(false);
    } catch (error) {
      setErrorMessage("Error occurred while accessing the chat.");
      setLoadingChat(false);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  return (
    <header className="flex justify-between items-center bg-white shadow-md px-4 py-2">
      {/* Search Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <i className="fas fa-search"></i>
        <span className="hidden md:inline">Search Users</span>
      </button>

      {/* Title */}
      <h1 className="text-xl font-bold text-gray-700">Bantar</h1>

      {/* Notification and Profile Menu */}
      <div className="flex items-center gap-4 relative">
        {/* Notifications */}
        {/* <div className="relative">
          <button
            className="relative"
            onClick={() => setIsDropdownOpenBell(!isDropdownOpenBell)}>
            <BellIcon className="w-6 h-6 text-gray-600" />
            {notification.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notification.length}
              </span>
            )}
          </button>
          {isDropdownOpenBell && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 shadow-md rounded-lg z-50">
              {notification.length > 0 ? (
                notification.map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => accessChat(notif.chat)}
                    className="p-2 hover:bg-gray-100 cursor-pointer">
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${notif.chat.users[0].name}`}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500 text-center">
                  No new messages
                </div>
              )}
            </div>
          )}
        </div> */}

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <img
              src={user?.pic}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
            <ChevronDownIcon className="w-5 h-5" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-lg z-50">
              <div
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsProfileModalOpen(true);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer">
                My Profile
              </div>
              <div className="border-t border-gray-200"></div>
              <div
                onClick={logoutHandler}
                className="p-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Error Notifier */}
      {errorMessage && (
        <ErrorNotifier
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          user={user}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* Search Drawer */}
      <SearchDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={user}
        setChats={setChats}
        setSelectedChat={setSelectedChat}
      />
    </header>
  );
};

export default ChatHeader;
