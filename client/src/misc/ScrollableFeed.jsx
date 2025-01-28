/* eslint-disable react/prop-types */
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogic";
import { useChatContext } from "../context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = useChatContext();
  console.log(messages);
  return (
    <ScrollableFeed>
      {messages &&
        messages?.map((m, i) => (
          <div key={m._id} className="flex items-start mb-2">
            {/* Avatar */}
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <div className="relative">
                <img
                  className="h-8 w-8 rounded-full mt-1 mr-2 cursor-pointer"
                  src={m.sender.pic}
                  alt={m.sender.name}
                />
                <div className="absolute bottom-0 left-0 text-xs text-white bg-black rounded-full px-1 py-0.5">
                  {m.sender.name}
                </div>
              </div>
            )}

            {/* Message bubble */}
            <span
              className={`${
                m.sender._id === user._id
                  ? "bg-blue-200 self-end"
                  : "bg-green-200 self-start"
              } rounded-2xl px-4 py-2 max-w-[75%]`}
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id)
                  ? "0.75rem"
                  : "1.25rem",
              }}>
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
