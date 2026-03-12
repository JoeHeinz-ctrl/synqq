import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Message {
  id: string;
  userId: number;
  userName: string;
  content: string;
  timestamp: Date;
  type: "text" | "system" | "file";
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

interface User {
  id: number;
  name: string;
  online: boolean;
}

export function useChat(projectId: string | undefined, userId: number | null, userName: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!projectId || !userId || !userName) {
      console.log("❌ Missing required data:", { projectId, userId, userName });
      return;
    }

    console.log("🔌 Connecting to socket...", SOCKET_URL);

    // Initialize socket connection
    const socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
      socket.emit("join_project", { projectId, userId, userName });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
      setIsConnected(false);
    });

    // Listen for messages
    socket.on("new_message", (message: Message) => {
      console.log("📨 New message received:", message);
      setMessages((prev) => [...prev, message]);
    });

    // Listen for user list updates
    socket.on("users_update", (userList: User[]) => {
      console.log("👥 Users updated:", userList);
      setUsers(userList);
    });

    // Listen for message history
    socket.on("message_history", (history: Message[]) => {
      console.log("📜 Message history:", history);
      setMessages(history);
    });

    return () => {
      console.log("🔌 Disconnecting socket");
      socket.emit("leave_project", { projectId });
      socket.disconnect();
    };
  }, [projectId, userId, userName]);

  const sendMessage = (content: string) => {
    if (!socketRef.current || !content.trim()) {
      console.log("❌ Cannot send message:", { 
        hasSocket: !!socketRef.current, 
        content: content.trim() 
      });
      return;
    }

    console.log("📤 Sending message:", content);
    socketRef.current.emit("send_message", {
      projectId,
      content: content.trim(),
    });
  };

  const sendFile = async (file: File) => {
    if (!socketRef.current) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      console.log("📤 Sending file:", file.name);
      
      socketRef.current?.emit("send_file", {
        projectId,
        fileName: file.name,
        fileData: base64,
        fileType: file.type,
        fileSize: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  return {
    messages,
    users,
    isConnected,
    sendMessage,
    sendFile,
    socket: socketRef.current,
  };
}
