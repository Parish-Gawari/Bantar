/* eslint-disable no-unused-vars */
import ChatHeader from "../components/Chats/ChatHeader";
import ChatSection from "../components/Chats/ChatSection";
import MyChats from "../components/Chats/MyChats";
import { useChatContext } from "../context/ChatProvider";
import { useState } from "react";

const ChatPage = () => {
  const { user } = useChatContext();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="flex flex-col h-screen">
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
