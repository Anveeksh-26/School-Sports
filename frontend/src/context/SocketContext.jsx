import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Create socket connection once
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      setConnected(true);
      console.log('✅ Socket connected:', socketRef.current.id);
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
      console.log('❌ Socket disconnected');
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  /** Join a specific match room to receive updates for that match */
  const joinMatch = (matchId) => {
    socketRef.current?.emit('join_match', matchId);
  };

  /** Leave a match room */
  const leaveMatch = (matchId) => {
    socketRef.current?.emit('leave_match', matchId);
  };

  /** Admin emits a score update for a match */
  const emitScoreUpdate = (data) => {
    socketRef.current?.emit('score_update', data);
  };

  /** Admin emits a status update for a match */
  const emitStatusUpdate = (data) => {
    socketRef.current?.emit('status_update', data);
  };

  /** Listen to events (used in components) */
  const onScoreUpdated = (callback) => {
    socketRef.current?.on('score_updated', callback);
    return () => socketRef.current?.off('score_updated', callback);
  };

  const onStatusUpdated = (callback) => {
    socketRef.current?.on('status_updated', callback);
    return () => socketRef.current?.off('status_updated', callback);
  };

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      connected,
      joinMatch,
      leaveMatch,
      emitScoreUpdate,
      emitStatusUpdate,
      onScoreUpdated,
      onStatusUpdated,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
