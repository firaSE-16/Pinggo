"use client";

import { useEffect, useState } from "react";
import { socket } from "../../../lib/socket";

export default function HomePage() {
  const [hydrated, setHydrated] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !socket) return;

    socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setTransport("N/A");
    };

    const onWelcome = (msg: string) => {
      setWelcomeMessage(msg);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("welcome", onWelcome);

    socket.emit("hello", "Hello from client");

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("welcome", onWelcome);
    };
  }, [hydrated]);

  if (!hydrated) return null;

  return (
    <div>
      <h2>Status: {isConnected ? "✅ Connected" : "❌ Disconnected"}</h2>
      <h3>Transport: {transport}</h3>
      <p>Server says: {welcomeMessage}</p>
    </div>
  );
}
