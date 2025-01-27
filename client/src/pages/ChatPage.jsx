/* eslint-disable no-unused-vars */
import ChatHeader from "../components/Chats/ChatHeader";
import MyChats from "../components/Chats/MyChats";
import { useChatContext } from "../context/ChatProvider";

const ChatPage = () => {
  const {
    user,
    selectedChat,
    chats,
    notification,
    setSelectedChat,
    setChats,
    setNotification,
  } = useChatContext();

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <header className="flex-shrink-0">
        <ChatHeader />
      </header>

      {/* Main Chat Section */}
      <main className="flex-grow bg-gray-100 p-4">
        <MyChats />
      </main>
    </div>
  );
};

export default ChatPage;
