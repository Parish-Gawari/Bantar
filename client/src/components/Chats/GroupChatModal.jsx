/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { useChatContext } from "../../context/ChatProvider";
import UserListItem from "../UserListItem";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { user, chats, setChats } = useChatContext();
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      setErrorMessage("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5005/api/users/allUser?search=${query}`,
        config
      );
      setLoading(false);
      setSearchResult(data?.data);
    } catch (error) {
      setErrorMessage("Failed to load the search results");
      setLoading(false);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      setErrorMessage("Please fill all the fields");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5005/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data?.data, ...chats]);
      setIsOpen(false);
    } catch (error) {
      setErrorMessage(error.response?.data || "Failed to create the chat");
    }
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Group Chat</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-xl">
                &times;
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Chat Name"
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Add Users (e.g., John, Jane)"
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {selectedUsers.map((user) => (
                <span
                  key={user._id}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center space-x-2">
                  {user.name}
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-white hover:text-red-500">
                    &times;
                  </button>
                </span>
              ))}
            </div>

            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              searchResult
                .slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}

            {errorMessage && (
              <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Create Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;
