import { io } from "socket.io-client";
export const socket = io("http://192.168.179.105:3001", {
  autoConnect: false,
  reconnectionAttempts: 3,
});
