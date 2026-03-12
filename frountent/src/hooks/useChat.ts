import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Message {
  id: string;
  userId: number;
  userName: string;
  content: string;
  timestamp: Date;
  type: "text" | "system";
}

interface User {
  id: number;
  name: string;
  online: boolean;
}

export function useChat(projectId: string | undefined, userId: number | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!projectId || !userId) return;

    // Initialize socket connection
    const socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
      socket.emit("join_project", { projectId, userId });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    // Listen for messages
    socket.on("new_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for user list updates
    socket.on("users_update", (userList: User[]) => {
      setUsers(userList);
    });

    // Listen for message history
    socket.on("message_history", (history: Message[]) => {
      setMessages(history);
    });

    return () => {
      socket.emit("leave_project", { projectId });
      socket.disconnect();
    };
  }, [projectId, userId]);

  const sendMessage = (content: string) => {
    if (!socketRef.current || !content.trim()) return;

    socketRef.current.emit("send_message", {
      projectId,
      content: content.trim(),
    });
  };

  return {
    messages,
    users,
    isConnected,
    sendMessage,
  };
}
