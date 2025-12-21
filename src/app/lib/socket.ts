import { io } from "socket.io-client";
export const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || 'http://localhost:3001', {
  autoConnect: false,
  reconnectionAttempts: 3,
  withCredentials: true,
});
