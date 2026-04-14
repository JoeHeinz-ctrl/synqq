import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "https://api.dozzl.xyz";

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
  const [joinNotification, setJoinNotification] = useState<{ name: string; userId: number } | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!projectId || !userId || !userName) return;

    const socket = io(SOCKET_URL, {
      path: "/socket.io/",
      auth: { token: localStorage.getItem("token") },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_project", { projectId, userId, userName });
    });

    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", () => setIsConnected(false));

    socket.on("new_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("users_update", (userList: User[]) => {
      setUsers(userList);
    });

    socket.on("message_history", (history: Message[]) => {
      setMessages(history);
    });

    // Notification when another user joins this project
    socket.on("user_joined", (data: { name: string; userId: number }) => {
      if (data.userId !== userId) {
        setJoinNotification(data);
        setTimeout(() => setJoinNotification(null), 4000);
      }
    });

    return () => {
      socket.emit("leave_project", { projectId });
      socket.disconnect();
    };
  }, [projectId, userId, userName]);

  const sendMessage = (content: string) => {
    if (!socketRef.current || !content.trim()) return;
    socketRef.current.emit("send_message", { projectId, content: content.trim() });
  };

  const sendFile = async (file: File) => {
    if (!socketRef.current) return;
    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current?.emit("send_file", {
        projectId,
        fileName: file.name,
        fileData: reader.result as string,
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
    joinNotification,
    sendMessage,
    sendFile,
    socket: socketRef.current,
  };
}
