/* eslint-disable react/prop-types */
import SingleChat from "./SingleChat";
import { useChatContext } from "../../context/ChatProvider";

const ChatSection = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChatContext();

  return (
    <div
      className={`${
        selectedChat ? "flex" : "hidden"
      } md:flex flex-col items-center p-3 bg-white w-full md:w-2/3 rounded-lg border border-gray-300`}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatSection;
