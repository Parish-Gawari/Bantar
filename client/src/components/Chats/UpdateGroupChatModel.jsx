/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { useChatContext } from "../../context/ChatProvider";
import UserBadgeItem from "../UserBadgeItem";
import UserListItem from "../UserListItem";
import ErrorNotifier from "../ErrorNotifier";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [error, setError] = useState(null); // To manage error messages

  const { selectedChat, setSelectedChat, user } = useChatContext();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to load search results.");
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5005/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName("");
    } catch (error) {
      setRenameLoading(false);
      setError("Error renaming group.");
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.some((u) => u._id === userToAdd._id)) {
      setError("User already in group!");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      setError("Only admins can add users!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5005/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: userToAdd._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Error adding user.");
    }
  };

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      setError("Only admins can remove users!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: userToRemove._id },
        config
      );
      if (userToRemove._id === user._id) {
        setSelectedChat(null);
      } else {
        setSelectedChat(data);
      }
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Error removing user.");
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-bold">{selectedChat.chatName}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {selectedChat.users.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(user)}
                  />
                ))}
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Rename Group"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
                <button
                  onClick={handleRename}
                  className="mt-2 bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                  disabled={renameLoading}>
                  {renameLoading ? "Updating..." : "Update"}
                </button>
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Add Users"
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              {loading ? (
                <div className="mt-4 text-center">
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="mt-4">
                  {searchResult.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => handleRemove(user)}
                className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600">
                Leave Group
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 py-1 px-4 rounded-md hover:bg-gray-400">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Notifier */}
      {error && (
        <ErrorNotifier message={error} onClose={() => setError(null)} />
      )}
    </>
  );
};

export default UpdateGroupChatModal;
