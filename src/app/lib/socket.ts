import { io } from "socket.io-client";
export const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || 'http://localhost:3001', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  withCredentials: true,
});
