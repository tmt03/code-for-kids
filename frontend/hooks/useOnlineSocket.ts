"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export function useOnlineSocket(userId?: string) {
  useEffect(() => {
    if (!userId) return;
    const socket: Socket = io(SOCKET_URL, { transports: ["websocket"] });
    socket.emit("user-online", userId);
    return () => { socket.disconnect(); };
  }, [userId]);
}