/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import ScrollableFeed from "react-scrollable-feed";
import { useEffect, useRef, useState } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogic";
import { useChatContext } from "../context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = useChatContext();
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Function to check if user is at the bottom
  const isUserAtBottom = () => {
    if (!chatContainerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 10; // Small buffer for smoothness
  };

  // Track manual scrolling by user
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      setShouldAutoScroll(isUserAtBottom()); // Update state based on user scrolling
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Check & scroll when new messages arrive
  useEffect(() => {
    if (isUserAtBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div ref={chatContainerRef} className="h-full overflow-y-auto max-h-full">
      <ScrollableFeed>
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
        <div ref={messagesEndRef} />
      </ScrollableFeed>
    </div>
  );
};

export default ScrollableChat;
