import React, { useState, useEffect } from "react";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyPitches() {
  const [user, setUser] = useState(null);
  const [pitches, setPitches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const [expandedPitch, setExpandedPitch] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
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
    if (user) {
      const fetchPitches = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8081/pitch/${user.id}`
          );
          setPitches(response.data.pitches || []);
        } catch (error) {
          console.error("Error fetching pitch data:", error);
        }
      };
      fetchPitches();
    }
  }, [user]);

  const filteredPitches = pitches.filter((pitch) =>
    `${pitch.pitch_title}${pitch.description}${pitch.category}${pitch.File}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const isImage = (fileName) => /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  const isVideo = (fileName) => /\.(mp4|webm|ogg)$/i.test(fileName);

  return (
    <>
      <style>
        {`
          .hover-zoom {
            transition: transform 0.3s ease-in-out;
            cursor: pointer;
            max-width: 100%;
            height: auto;
            object-fit: cover;
          }

          .hover-zoom:hover {
            transform: scale(1.1);
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 70%);
            padding: 10px;
            border-radius: 10px;
          }

          .modal-content img {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 5px;
          }

          .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 28px;
            color: white;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.6);
            padding: 5px 10px;
            border-radius: 50%;
          }
        `}
      </style>

      <div className={`app sidebar-mini ${sidebarToggled ? "sidenav-toggled" : ""}`}>
        <Header handleToggle={() => setSidebarToggled(!sidebarToggled)} />
        <Sidebar />
        <main className="app-content">
          <div className="row">
            <div className="col-md-12">
              <div className="tile">
                <div className="tile-body">
                  <div className="mb-3">
                    <div className="row">
                      <div className="col-md-5">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {filteredPitches.length > 0 ? (
                      filteredPitches.map((pitch) => (
                        <div className="col-md-4" key={pitch.id}>
                          <div className="card">
                            <div className="card-body">
                              <h5 className="card-title">{pitch.pitch_title}</h5>
                              
                              {isImage(pitch.File) && (
                                <img
                                  src={`http://localhost:8081/${pitch.File}`}
                                  className="card-img-top img-fluid hover-zoom"
                                  alt={pitch.pitch_title}
                                  style={{ height: "200px", objectFit: "cover" }}
                                  onClick={() => setSelectedImage(`http://localhost:8081/${pitch.File}`)}
                                />
                              )}

                              {isVideo(pitch.File) && (
                                <video controls className="w-100 h-100">
                                  <source src={`http://localhost:8081/${pitch.File}`} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              )}

                              <p className="card-text">
                                {expandedPitch === pitch.id
                                  ? pitch.description
                                  : pitch.description.split(" ").slice(0, 10).join(" ") + "..."}
                                {pitch.description.split(" ").length > 10 && (
                                  <button
                                    className="btn btn-link"
                                    onClick={() =>
                                      setExpandedPitch(expandedPitch === pitch.id ? null : pitch.id)
                                    }
                                  >
                                    {expandedPitch === pitch.id ? "Show Less" : "Read More"}
                                  </button>
                                )}
                              </p>

                              <div className="d-flex justify-content-between mt-3">
                                <button className="btn btn-info">View Details</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12">
                        <p className="text-center">No pitches found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <span className="close-btn" onClick={() => setSelectedImage(null)}>
              ✖
            </span>
            <img src={selectedImage} alt="Full Size" />
          </div>
        </div>
      )}
    </>
  );
}

export default MyPitches;
