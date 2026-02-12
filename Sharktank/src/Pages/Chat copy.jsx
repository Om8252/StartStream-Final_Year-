import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import CryptoJS from "crypto-js";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";

const socket = io("http://localhost:8081");

function Chat() {
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const { receiverid } = useParams();
  const messagesEndRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("updateOnlineUsers");
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const encryptedUser = localStorage.getItem("user");
    const secretKey = localStorage.getItem("secretKey");

    if (!token || !encryptedUser || !secretKey) {
      navigate("/");
      return;
    }

    const decryptUser = (encryptedData, key) => {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, key);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (error) {
        console.error("Error decrypting user data:", error);
        return null;
      }
    };

    const decryptedUser = decryptUser(encryptedUser, secretKey);
    if (decryptedUser) {
      setUser(decryptedUser);
      socket.emit("join", { userId: decryptedUser.id, receiverId: receiverid });

      socket.emit("fetchChat", {
        userId1: decryptedUser.id,
        userId2: receiverid,
      });
    } else {
      navigate("/");
    }
  }, [navigate, receiverid]);

  useEffect(() => {
    if (!user) return;

    socket.emit("joinRoom", { userId1: user.id, userId2: receiverid });
    socket.emit("fetchChat", { userId1: user.id, userId2: receiverid });

    socket.on("chatHistory", (chatMessages) => {
      setMessages(chatMessages);

      // Extract opponent details from messages
      if (chatMessages.length > 0) {
        const firstMessage = chatMessages[0];
        const isOpponentSender = firstMessage.Sender_id !== user.id;

        setOpponent({
          fname: isOpponentSender
            ? firstMessage.SenderFname
            : firstMessage.ReceiverFname,
          lname: isOpponentSender
            ? firstMessage.SenderLname
            : firstMessage.ReceiverLname,
          profileImg: isOpponentSender
            ? firstMessage.SenderProfileImg
            : firstMessage.ReceiverProfileImg,
        });
      }
    });

    socket.on("receiveMessage", (newMsg) => {
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("receiveMessage");
    };
  }, [user, receiverid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      sender: user.id,
      receiver: receiverid,
      message: newMessage,
    };

    socket.emit("sendMessage", messageData);

    setMessages((prev) => [
      ...prev,
      { ...messageData, timestamp: new Date().toISOString() },
    ]);
    setNewMessage("");
  };

  const formatMessageDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    const isYesterday =
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Mark messages as read when the receiver opens the chat
  useEffect(() => {
    if (user && receiverid && messages.length > 0) {
      socket.emit("markAsRead", { sender: receiverid, receiver: user.id });
    }
  }, [user, receiverid, messages]); // Add messages as a dependency

  useEffect(() => {
    socket.on("messageRead", ({ messageIds }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
        )
      );
    });

    return;
  }, []);

  return (
    <div
      className={`app sidebar-mini ${sidebarToggled ? "sidenav-toggled" : ""}`}
    >
      <Header handleToggle={() => setSidebarToggled(!sidebarToggled)} />
      <Sidebar />
      <main className="app-content background">
        <div className="row">
          <div className="col-md-12">
            <div className="tile">
              {opponent && (
                <div className="opponent-info d-flex align-items-center mb-3">
                  <img
                    src={`http://localhost:8081${opponent?.profileImg}`}
                    alt="Opponent"
                    className="rounded-circle"
                    style={{ width: 57, height: 50, marginRight: 10 }}
                  />
                  <h5 className="mb-0">
                    {`${opponent?.fname} ${opponent?.lname}`}
                    {onlineUsers.includes(receiverid) ? (
                      <span style={{ color: "green", marginLeft: 10 }}>
                        ● Online
                      </span>
                    ) : (
                      <span style={{ color: "red", marginLeft: 10 }}>
                        ● Offline
                      </span>
                    )}
                  </h5>
                </div>
              )}
              <div className="messanger">
                <div className="messages">
                  {messages.length > 0 && (
                    <>
                      {messages.map((msg, index) => {
                        const prevMessage = messages[index - 1];
                        const currentDate = formatMessageDate(msg.timestamp);
                        const prevDate = prevMessage
                          ? formatMessageDate(prevMessage.timestamp)
                          : null;

                        return (
                          <React.Fragment key={index}>
                            {prevDate !== currentDate && (
                              <div className="text-center">
                                <b>
                                  <span className="">{currentDate}</span>
                                </b>
                              </div>
                            )}
                            <div
                              className={`message ${
                                msg.Sender_id === user?.id ? "me" : ""
                              }`}
                            >
                              <img
                                className="rounded-circle me-3"
                                style={{
                                  width: 50,
                                  height: 40,
                                  objectFit: "cover",
                                }}
                                src={
                                  msg.receiverId === user?.id
                                    ? `http://localhost:8081${msg.ReceiverProfileImg}`
                                    : `http://localhost:8081${msg.SenderProfileImg}`
                                }
                                alt="user"
                              />

                              <div className="message-content">
                                {msg.Content ? (
                                  /<[a-z][\s\S]*>/i.test(msg.Content) ? (
                                    <div
                                      className="info"
                                      dangerouslySetInnerHTML={{
                                        __html: msg.Content,
                                      }}
                                    ></div>
                                  ) : (
                                    <p className="info">{msg.Content}</p>
                                  )
                                ) : (
                                  <p className="info">No content available</p>
                                )}

                                <span className="message-time">
                                  {msg.timestamp
                                    ? new Date(
                                        msg.timestamp
                                      ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })
                                    : "Time Unavailable"}
                                  {msg.Sender_id === user?.id && (
                                    <span
                                      style={{
                                        marginLeft: 5,
                                        color: msg.is_read ? "blue" : "gray",
                                      }}
                                    >
                                      {msg.is_read ? "✔✔" : "✔"}
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                <div className="sender">
                <div className="btn-group me-3">
    <button
      className="btn btn-primary  rounded"
      type="button"
      id="dropdownMenuButton"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      +
    </button>
    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <li>
        <button className="dropdown-item" onClick={() => prompt("Option 1 selected")}>
          Request for payment 
        </button>
      </li>
      
    </ul>
  </div>

                  <textarea
                    className="w-100 "
                    type="text"
                    placeholder="Send Message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    className="btn btn-primary rounded"
                    type="button"
                    onClick={handleSendMessage}
                  >
                    <i className="bi bi-send fs-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Chat;
