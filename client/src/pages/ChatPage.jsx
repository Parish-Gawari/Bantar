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
    <div>
      <ChatHeader />
      <MyChats />
    </div>
  );
};

export default ChatPage;
