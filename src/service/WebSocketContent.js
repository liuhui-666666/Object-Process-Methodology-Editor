// WebSocketContext.js
import React, { createContext, useEffect } from "react";
import WebSocketService from "./WebSocket";
import { useLocation } from 'react-router-dom';
export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const wsService = WebSocketService.getInstance();
  const location = useLocation();
  const url = `ws://${window.location.host}/realtime`
  useEffect(() => {
    wsService.connect(url);
    return () => {
      // 清理连接
      wsService.socket && wsService.socket.close();
    };
  }, [wsService]);

  return (
    <WebSocketContext.Provider value={wsService}>
      {children}
    </WebSocketContext.Provider>
  );
};

