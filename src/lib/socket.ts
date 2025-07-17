'use client'

import { io, Socket } from "socket.io-client"

interface ServerToClientEvents {
    welcome: (message: string) => void;
    "users:online": (userIds: string[]) => void;
    "chat:message": (data: { to: string; from: string; message: string; timestamp: string }) => void;
}

interface ClientToServerEvents {
    hello: (message: string) => void;
    "user:online": (userId: string) => void;
    "chat:message": (data: { to: string; from: string; message: string; timestamp: string }) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
    autoConnect: false,
})

export function connectSocket(userId: string) {
    if (!socket.connected) {
        socket.connect();
        socket.emit("user:online", userId);
    }
}

export function disconnectSocket() {
    if (socket.connected) {
        socket.disconnect();
    }
}