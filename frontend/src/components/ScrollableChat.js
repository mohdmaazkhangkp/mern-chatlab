import { Avatar, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';


const ScrollableChat = ({ messages }) => {
  const {user} = ChatState();
   const messagesEndRef = useRef(null);

   const scrollToBottom = () => {
     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   useEffect(() => {
     scrollToBottom();
   }, [messages]);

  return (
    <div>
      {messages &&
        messages.map((m, i) => (
          <div ref={messagesEndRef} key={m._id} style={{ display: "flex" }}>
            {(isSameSender(messages, m, i, user) ||
              isLastMessage(messages, i, user)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor:
                  m.sender._id === user._id ? "#DCF8C6" : "#FFFFFF",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </div>
  );
};

export default ScrollableChat