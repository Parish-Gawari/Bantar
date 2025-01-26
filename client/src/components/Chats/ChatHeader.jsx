/* eslint-disable no-unused-vars */
import { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useChatContext } from "../../context/ChatProvider";
import axios from "axios";
import ErrorNotifier from "../ErrorNotifier";
import ProfileModal from "../ProfileModal";
import SearchDrawer from "./SearchDrawer";

const ChatHeader = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for profile dropdown
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // State for profile modal

  const {
    user,
    notification,
    setNotification,
    setSelectedChat,
    chats,
    setChats,
  } = useChatContext();
  const handleSearch = async () => {
    if (!search) {
      setErrorMessage("Please enter something in the search.");
      return;
    }

    try {
      setLoading(true);

      // Simulated API call for search
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get(`/api/user?search=${search}`, config);

      setSearchResult(response.data);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Error occurred while fetching search results.");
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((chat) => chat._id === response.data._id)) {
        setChats([response.data, ...chats]);
      }

      setSelectedChat(response.data);
      setLoadingChat(false);
      setIsDrawerOpen(false);
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
        <div className="relative">
          <button className="relative">
            <BellIcon className="w-6 h-6 text-gray-600" />
            {notification.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notification.length}
              </span>
            )}
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <img
              src={user?.data?.pic}
              alt={user?.data?.name}
              className="w-8 h-8 rounded-full"
            />
            <ChevronDownIcon className="w-5 h-5" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-lg z-50">
              <div
                onClick={() => {
                  setIsDropdownOpen(false); // Close dropdown
                  setIsProfileModalOpen(true); // Open profile modal
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

      {/* Search Drawer */}
      {/* {isDrawerOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-bold">Search Users</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-600 hover:text-gray-900">
                &times;
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow border border-gray-300 rounded-lg p-2"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Search
              </button>
            </div>
            <div className="mt-4">
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                searchResult.map((user) => (
                  <div
                    key={user._id}
                    className="p-2 border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => accessChat(user._id)}>
                    {user.name}
                  </div>
                ))
              )}
              {loadingChat && (
                <p className="text-center text-gray-500 mt-4">
                  Opening chat...
                </p>
              )}
            </div>
          </div>
        </div>
      )} */}

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
          user={user?.data}
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
