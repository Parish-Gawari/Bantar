/* eslint-disable no-unused-vars */
import ChatHeader from "../components/Chats/ChatHeader";
import ChatSection from "../components/Chats/ChatSection";
import MyChats from "../components/Chats/MyChats";
import { useChatContext } from "../context/ChatProvider";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SuccessNotifier from "../misc/SuccessNotifier";

const ChatPage = () => {
  const { user } = useChatContext();
  const location = useLocation();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || null
  );

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000); // Auto-hide the notification after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="flex flex-col h-screen">
      {/* Success Notification */}
      {successMessage && (
        <SuccessNotifier
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* Chat Header */}
      <header className="flex-shrink-0">{user && <ChatHeader />}</header>

      {/* Main Chat Section */}
      <main className="flex-grow bg-black p-4 flex flex-col md:flex-row gap-4">
        {/* My Chats Section */}
        {user && (
          <div className="flex flex-col w-full md:w-1/3 lg:w-1/4 bg-white rounded-lg shadow-md border border-gray-300">
            <MyChats fetchAgain={fetchAgain} />
          </div>
        )}

        {/* Chatbox Section */}
        {user && (
          <div className="flex-grow w-full md:w-2/3 lg:w-3/4 bg-white rounded-lg shadow-md border border-gray-300">
            <ChatSection
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
