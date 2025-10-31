// socket/chatHandler.js
export const chatHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (username) => {
      socket.username = username || "Anonymous";
      io.emit("chat-message", {
        user: "System",
        text: `${socket.username} joined the chat.`,
        time: new Date().toLocaleTimeString(),
      });
    });

    socket.on("send-message", (msg) => {
      io.emit("chat-message", {
        user: socket.username || "Anonymous",
        text: msg,
        time: new Date().toLocaleTimeString(),
      });
    });

    socket.on("disconnect", () => {
      if (socket.username) {
        io.emit("chat-message", {
          user: "System",
          text: `${socket.username} left the chat.`,
          time: new Date().toLocaleTimeString(),
        });
      }
    });
  });
};
