import React, { createContext, useEffect, useState } from "react";

// Create a context
const CounterContext = createContext();

// Create a provider component
const CounterProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection to Vercel
    const socket = new WebSocket("wss://ws-notif.vercel.app");

    socket.onopen = () => {
      console.log("WebSocket connected");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      // Handle received messages and update count if necessary
      if (message.type === "updateCount") {
        setCount(message.count);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setWs(null);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "increment" }));
    }
  };

  const decrement = () => {
    setCount((prevCount) => prevCount - 1);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "decrement" }));
    }
  };

  const reset = () => {
    setCount(0);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "reset" }));
    }
  };

  return (
    <CounterContext.Provider value={{ count, increment, decrement, reset }}>
      {children}
    </CounterContext.Provider>
  );
};

export { CounterContext, CounterProvider };
