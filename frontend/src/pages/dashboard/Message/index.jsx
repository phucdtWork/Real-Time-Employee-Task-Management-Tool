import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bubble, Sender } from "@ant-design/x";
import ConversationBox from "./components/ConversationBox";
import { getCurrentUser } from "../../../apis/commonAPI";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../../../apis/messageAPI";
import { Spin } from "antd";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";

import SocketService from "../../../service/socketService";
import formatTimestamp from "../../../../../backend/src/utils/formatTimestamp";
import { getAllUsers } from "../../../apis/ownerAPI";
import checkCurrentUser from "../../../utils/checkCurrentUser";
import EmployeeChatList from "./components/employeeChatList";

function MessagePage() {
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [employees, setEmployees] = useState([]);

  const [inputValue, setInputValue] = useState(""); // State để control input

  const [currentConversation, setCurrentConversation] = useState();
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 100);
  }, []);

  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    try {
      const response = await getMessages(conversationId);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await getAllUsers();

      if (response.data) {
        const existingParticipantIds = conversations.map(
          (conv) => conv.otherParticipantId
        );

        const availableEmployees = response.data.filter(
          (user) =>
            !existingParticipantIds.includes(user.id) &&
            user.id !== currentUser?.id
        );

        setEmployees(availableEmployees);
        return availableEmployees;
      }

      return [];
    } catch (error) {
      return [];
    }
  }, [conversations, currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id && conversations.length >= 0) {
      fetchEmployees();
    }
  }, [conversations, currentUser?.id, fetchEmployees]);

  const fetchCurrentUser = async () => {
    try {
      const response = await getCurrentUser();
      setCurrentUser(response.data.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await getConversations();
      setConversations(response.data);
      if (!currentConversation && response.data.length > 0) {
        setCurrentConversation(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchConversations();
      await fetchCurrentUser();
    };
    initializeData();
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchMessages(currentConversation?.id);
    scrollToBottom();
  }, [currentConversation, fetchMessages, currentUser]);

  const handleNewMessage = useCallback(() => {
    fetchMessages(currentConversation?.id);
    fetchConversations();
  }, [currentConversation?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      SocketService.connect(currentUser.id);
      SocketService.on("new-message", handleNewMessage);

      if (currentConversation?.id) {
        SocketService.joinConversation(currentConversation.id);
      }
    }

    return () => {
      if (currentConversation?.id) {
        SocketService.leaveConversation(currentConversation.id);
      }
    };
  }, [currentConversation, currentUser, handleNewMessage]);

  const handleSend = async (messageContent) => {
    if (!messageContent.trim() || !currentConversation?.id) {
      return;
    }

    try {
      const response = await sendMessage({
        conversationId: currentConversation.id,
        sender2Id: currentConversation.otherParticipantId,
        messageContent,
      });
      setInputValue("");

      if (response.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: response.data.id,
            content: response.data.message,
            role: "user",
            timestamp: response.data.timestamp,
          },
        ]);

        fetchConversations();
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex-col justify-between gap-2 w-full">
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            <div className="mt-4">
              {checkCurrentUser("owner") == true ? (
                <EmployeeChatList
                  employees={employees}
                  onCreateConversation={() => {
                    fetchEmployees();
                    fetchConversations();
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex-1 max-h-[calc(100vh-200px)] overflow-y-auto overflow-hidden">
          <ConversationBox
            setCurrentConversation={setCurrentConversation}
            conversations={conversations}
          />
        </div>
      </div>

      <div className="flex-1 max-h-[calc(100vh-200px)] flex flex-col">
        {currentConversation ? (
          <>
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                {conversations && (
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {currentConversation?.name}
                    </h3>
                    <p className="text-sm text-green-500">Active</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Don't have message</p>
                </div>
              ) : (
                messages?.map((message) => (
                  <Bubble
                    placement={message.role === "user" ? "end" : "start"}
                    content={message.content}
                    key={message.id}
                    title={formatTimestamp(message.timestamp)}
                    type={message.role === "user" ? "primary" : "default"}
                    avatar={{
                      icon: <UserOutlined />,
                      style: {
                        backgroundColor:
                          message.role === "user" ? "#87d068" : "#fde3cf",
                      },
                    }}
                  />
                ))
              )}
              <div ref={messagesEndRef} style={{ height: "1px" }} />
            </div>

            <div className="bg-white border-t border-gray-200 p-4">
              <Sender
                placeholder="Enter your message..."
                onSubmit={handleSend}
                value={inputValue}
                onChange={setInputValue}
                style={{ borderRadius: "24px" }}
              />
            </div>
          </>
        ) : (
          <p className="flex items-center justify-center h-full text-gray-500">
            Do not have any conversations
          </p>
        )}
      </div>
    </div>
  );
}

export default MessagePage;
