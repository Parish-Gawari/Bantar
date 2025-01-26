/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// SearchDrawer.js
import { useState } from "react";
import axios from "axios";
import UserListItem from "../UserListItem";

const SearchDrawer = ({ isOpen, onClose, user, setChats, setSelectedChat }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  console.log(user);
  const handleSearch = async () => {
    if (!search) {
      setErrorMessage("Please enter something in the search.");
      return;
    }

    try {
      setLoading(true);

      // API call for search
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      const response = await axios.get(
        `http://localhost:5005/api/users/allUser?search=${search}`,
        config
      );
      console.log(response?.data);
      setSearchResult(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Error occurred while fetching search results.");
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const response = await axios.post(
        "http://localhost:5005/api/chat/access",
        { userId },
        config
      );

      if (!setChats.find((chat) => chat._id === response.data._id)) {
        setChats([response.data, ...setChats]);
      }

      setSelectedChat(response.data);
      setLoadingChat(false);
      onClose(); // Close drawer after selecting a user
    } catch (error) {
      setErrorMessage("Error occurred while accessing the chat.");
      setLoadingChat(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-50 transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      <div className="bg-white w-96 h-full rounded-lg shadow-lg p-6 transition-all duration-300 ease-in-out transform">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-bold">Search Users</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900">
            &times;
          </button>
        </div>

        {/* Search Bar */}
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

        {/* Display Search Results */}
        <div className="mt-4 space-y-2">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : searchResult.length > 0 ? (
            searchResult.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
          {loadingChat && (
            <p className="text-center text-gray-500 mt-4">Opening chat...</p>
          )}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 mt-4">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default SearchDrawer;
