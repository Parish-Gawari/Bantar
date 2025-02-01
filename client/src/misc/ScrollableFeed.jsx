/* eslint-disable react/prop-types */
import ScrollableFeed from "react-scrollable-feed";
import { useEffect, useRef } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogic";
import { useChatContext } from "../context/ChatProvider";
const ScrollableChat = ({ messages }) => {
  const { user } = useChatContext();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollableFeed className="h-full overflow-y-auto max-h-full">
      {messages?.map((m, i) => (
        <div key={m._id} className="flex items-start mb-2">
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <div
              className={`relative ${
                m.sender._id === user._id ? "ml-auto" : ""
              }`}>
              <img
                className="h-8 w-8 rounded-full mt-4 mr-2 cursor-pointer"
                src={m.sender.pic}
              />
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
      <div ref={messagesEndRef} /> {/* This ensures auto-scroll */}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
