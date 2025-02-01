/* eslint-disable no-unused-vars */
import ChatHeader from "../components/Chats/ChatHeader";
import ChatSection from "../components/Chats/ChatSection";
import MyChats from "../components/Chats/MyChats";
import { useChatContext } from "../context/ChatProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SuccessNotifier from "../misc/SuccessNotifier";
import "../index.css";

const ChatPage = () => {
  const { user } = useChatContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.fromLogin ? "Login successful" : null
  );

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000); // Auto-hide the notification after 5 seconds

      // Clear the success message from history state after displaying it
      navigate(location.pathname, { replace: true });

      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate, location.pathname]);

  return (
    <div className="flex flex-col main">
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
      <main className="flex-grow bg-black p-4 flex flex-col md:flex-row gap-4 chatContainer">
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
