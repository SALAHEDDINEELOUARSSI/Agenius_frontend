//utils/websocket.ts
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function connectWebSocket(
    token: string,
    sessionId: string,
    onMessage: (data: any) => void
): Client {
  console.log(`Connecting to WebSocket with token: ${token}`);
  const client = new Client({
    // SockJS remplace brokerURL
    webSocketFactory: () => new SockJS('http://localhost:8070/ws-progress'),
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      console.log(`Connected to WebSocket for session: ${token}`);
      client.subscribe(`/topic/progress/${sessionId}`, (message) => {
        const body = JSON.parse(message.body);
        onMessage(body);
      });
    },
    onStompError: (frame) => {
      console.error('WebSocket STOMP error:', frame.headers['message']);
    },
  });

  client.activate();
  return client;
}