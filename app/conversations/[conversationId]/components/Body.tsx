"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { find } from "lodash";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/app/libs/pusher";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState<FullMessageType[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  // Mark conversation as seen on load
  useEffect(() => {
    if (conversationId) {
      axios.post(`/api/conversations/${conversationId}/seen`);
    }
  }, [conversationId]);

  // Handle real-time messages via Pusher
  useEffect(() => {
    if (!conversationId) return;

    pusherClient.subscribe(conversationId);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    const handleNewMessage = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        // Prevent duplicate messages
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });

      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }
          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", handleNewMessage);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", handleNewMessage);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          key={message.id}
          data={message}
          isLast={i === messages.length - 1}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
