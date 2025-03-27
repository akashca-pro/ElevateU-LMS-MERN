import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL)

// Register user with socket connection
export const registerSocket = (userId, role) => {
    socket.emit('register', {userId, role});
} 

export default socket