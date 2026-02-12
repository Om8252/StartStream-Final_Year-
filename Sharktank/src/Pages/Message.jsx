import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";

function Message() {
  const [user, setUser] = useState(null);
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const [communicationList, setCommunicationList] = useState([]);
  const navigate = useNavigate();

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
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:8081/messages/${user.id}`)
      .then((response) => {
        if (response.data.success) {
          const opponents = response.data.Content.filter(
            (opponent) => opponent.id !== user.id
          );
          setCommunicationList(opponents);
        } else {
          console.error(
            "Error fetching communications:",
            response.data.Content
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching communications:", error);
      });
  }, [user]);

  return (
    <div
      className={`app sidebar-mini ${sidebarToggled ? "sidenav-toggled" : ""}`}
    >
      <Header handleToggle={() => setSidebarToggled(!sidebarToggled)} />
      <Sidebar />
      <main className="app-content">
        <div className="tile">
          <h3>Communication List</h3>
          <ul className="list-group">
            {communicationList.length > 0 ? (
              communicationList.map((opponent) => (
                  <li
                    key={opponent.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    onClick={() => navigate(`/Chat/${opponent.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                  <div className="d-flex align-items-center">
                    {/* Profile Image */}
                    <img
                      src={`http://localhost:8081${opponent.ProfileImg}` || "/default-avatar.png"} // Fallback to default image
                      alt={`${opponent.fname} Profile`}
                      className="rounded-circle me-3"
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                    <div>
                      <strong>
                      
                        {opponent.fname}{" "}
                        {opponent.mname ? opponent.mname + " " : ""}
                        {opponent.lname}
                      </strong>
                      <br />
                      <small>@{opponent.username}</small>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="list-group-item text-center">
                No communication history
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Message;
