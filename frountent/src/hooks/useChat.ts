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
      path: "/socket.io/",
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      console.log("🔗 Socket transport:", socket.io.engine.transport.name);
      setIsConnected(true);
      
      const joinData = { projectId, userId, userName };
      console.log("📤 Emitting join_project:", joinData);
      socket.emit("join_project", joinData);
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
      setMessages((prev) => {
        console.log("📝 Current messages:", prev.length);
        const updated = [...prev, message];
        console.log("📝 Updated messages:", updated.length);
        return updated;
      });
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
        content: content.trim(),
        isConnected: socketRef.current?.connected
      });
      return;
    }

    console.log("📤 Sending message:", { projectId, content: content.trim() });
    socketRef.current.emit("send_message", {
      projectId: projectId,
      content: content.trim(),
    });
    console.log("✅ Message emitted");
  };

  const sendFile = async (file: File) => {
    if (!socketRef.current) {
      console.log("❌ Cannot send file: no socket connection");
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      console.log("📤 Sending file:", { projectId, fileName: file.name, fileSize: file.size });
      
      socketRef.current?.emit("send_file", {
        projectId: projectId,
        fileName: file.name,
        fileData: base64,
        fileType: file.type,
        fileSize: file.size,
      });
      console.log("✅ File emitted");
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
