/**
 * @file socket.js
 * @description Configures Socket.IO for real-time messaging, including JWT authentication and event listeners.

 * @architecture Utility layer extending the HTTP server with WebSocket capabilities for real-time state synchronization. */

const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const configureSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST", "PATCH"],
    },
  });

  // JWT Authentication Middleware for Socket Connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach user info to socket
      socket.user = decoded;
      next();
    } catch (_err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  // Event Listeners
  io.on("connection", (socket) => {
    // Join a specific chat room (chatId)
    socket.on("joinChat", ({ chatId }) => {
      if (chatId) {
        socket.join(chatId);
      }
    });

    // Handle sending real-time messages
    socket.on("sendMessage", (data) => {
      const { chatId, message, attachment } = data;
      // Broadcast the new message to everyone in the room except the sender
      socket.to(chatId).emit("receiveMessage", {
        chatId,
        senderId: socket.user.id,
        message,
        attachment,
        createdAt: new Date().toISOString(),
      });
    });

    // Handle read receipts
    socket.on("markMessagesRead", ({ chatId }) => {
      socket.to(chatId).emit("messagesRead", {
        chatId,
        readerId: socket.user.id,
      });
    });

    socket.on("disconnect", () => {
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized. Call configureSocket first.",
    );
  }
  return io;
};

module.exports = { configureSocket, getIo };
