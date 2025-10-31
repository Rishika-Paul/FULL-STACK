import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./Chat.css";

const socket = io("http://localhost:4000");

const Chat = () => {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("chat-message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoin = () => {
    if (username.trim()) {
      socket.emit("join", username);
      setJoined(true);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("send-message", message);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h2>Real-Time Chat</h2>
      {!joined ? (
        <div className="join">
          <input
            placeholder="Enter your name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleJoin}>Join</button>
        </div>
      ) : (
        <>
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className="message">
                <strong>{m.user}</strong> [{m.time}]: {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="send-form">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Chat;
