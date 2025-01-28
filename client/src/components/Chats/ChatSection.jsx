/* eslint-disable react/prop-types */
import SingleChat from "./SingleChat";
import { useChatContext } from "../../context/ChatProvider";

const ChatSection = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChatContext();

  return (
    <div
      className={`${
        selectedChat ? "flex" : "hidden"
      } md:flex flex-col items-center p-3 bg-white w-full md:w-3/3 rounded-lg border-0 border-gray-300 h-full`}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatSection;
