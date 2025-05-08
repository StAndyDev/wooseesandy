// src/hooks/useWebSocket.ts
import { useWebSocketContext } from '../contexts/WebSocketContext';

// permet d'envoyer des messages au serveur via le WebSocket
export const useSendMessageToServer = () => {
  const socket = useWebSocketContext();

  const sendMessage = (data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("Envoi du message au serveur :", data);
      socket.send(JSON.stringify(data));
    }else {
      console.warn("WebSocket non connecté. Impossible d'envoyer le message.");
    }
  };

  return sendMessage;
};