import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import { io } from "socket.io-client";

function Rejected() {
  const [pitches, setPitches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const [expandedPitch, setExpandedPitch] = useState(null);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const socket = io("http://localhost:8081"); // Adjust this URL to your backend

  const handleToggle = () => {
    setSidebarToggled(!sidebarToggled);
  };


  const handleGoToProfile = (userId) => {
    navigate(`/profile1/${userId}`);
  };

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
    if (user && user.role !== "Investor") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    axios
      .get("http://localhost:8081/pitchg")
      .then((response) => {
        if (response.data.success) {
          const userId = user.id.toString();
          setPitches(
            response.data.pitches
              .map((pitch) => {
                const acceptedIds = pitch.Reject ? pitch.Reject.split(",") : [];
                return {
                  ...pitch,
                  status: acceptedIds.includes(userId) ? "Rejected" : "",
                };
              })
              .filter((pitch) => pitch.status === "Rejected")
          );
        } else {
          console.error("Error fetching pitches:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching pitches:", error);
      });
  }, [user]);

  const isImage = (file) => {
    return (
      file &&
      (file.endsWith(".jpg") ||
        file.endsWith(".jpeg") ||
        file.endsWith(".png") ||
        file.endsWith(".gif"))
    );
  };

  const isVideo = (file) => {
    return (
      file &&
      (file.endsWith(".mp4") || file.endsWith(".webm") || file.endsWith(".ogg"))
    );
  };

  const filteredPitches = pitches.filter((pitch) =>
    `${pitch.pitch_title}${pitch.description}${pitch.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleAccept = (pitch, receiverId) => {
    if (!user || !user.id) {
      console.error("User ID is not available");
      return;
    }

    axios
      .put("http://localhost:8081/accept", {
        userId: user.id,
        pitchId: pitch.id,
      })
      .then((response) => {
        if (response.data.success) {
          console.log("Pitch accepted successfully");
          setPitches((prevPitches) =>
            prevPitches.map((p) =>
              p.id === pitch.id
                ? {
                  ...p,
                  status: "Accepted",
                }
                : p
            )
          );

          // Construct HTML message
          const messageHtml = `
    <div class="info">
  <div class="card" style="width: 311px;">
    <div class="card-body">
      <h3 class="card-title">${pitch.pitch_title}</h3>
      <p><strong>Category:</strong> ${pitch.category}</p>
      <p>
        <strong>Description:</strong> 
        <span id="desc-${pitch.id}">${pitch.description.slice(0, 100)}</span>
        ${pitch.description.length > 100
              ? `
          <span id="collapse-${pitch.id
              }" class="collapse">${pitch.description.slice(100)}</span>
          <button class="btn btn-link p-0" data-bs-toggle="collapse" data-bs-target="#collapse-${pitch.id
              }">
            Read More
          </button>
        `
              : ""
            }
      </p>
      ${pitch.File
              ? isImage(pitch.File)
                ? `<span class="pitchimg1"><img src="http://localhost:8081/${pitch.File}" alt="Pitch Image" class="img-fluid  mx-auto" style="max-width: 100%; height: auto;" /></span>`
                : isVideo(pitch.File)
                  ? `<video controls class="w-100">
                  <source src="http://localhost:8081/${pitch.File}" type="video/mp4" />
               </video>`
                  : `<a href="http://localhost:8081/${pitch.File}" target="_blank" class="btn btn-primary btn-sm">View Attachment</a>`
              : ""
            }
    </div>
  </div>
</div>
<!-- Bootstrap JS (Ensure Bootstrap JS is included for collapse functionality) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
`;

          // Send message with HTML structure
          const messageData = {
            message: messageHtml,
            sender: user.id,
            receiver: receiverId, // pitch owner ID
            timestamp: new Date(),
          };

          socket.emit("sendMessage", messageData);
        } else {
          console.error("Error accepting pitch:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error accepting pitch:", error);
      });
  };

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

          .modal-content img, .modal-content video {
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
      <div
        className={`app sidebar-mini ${
          sidebarToggled ? "sidenav-toggled" : ""
        }`}
      >
        <Header handleToggle={handleToggle} />
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
                            {isImage(pitch.File) && (
                              <img
                                src={`http://localhost:8081/${pitch.File}`}
                                className="card-img-top img-fluid hover-zoom"
                                alt={pitch.pitch_title}
                                style={{ height: "200px", objectFit: "cover" }}
                                onClick={() =>
                                  setSelectedImage(
                                    `http://localhost:8081/${pitch.File}`
                                  )
                                }
                              />
                            )}
                            {isVideo(pitch.File) && (
                              <video
                                className="card-img-top img-fluid hover-zoom"
                                style={{
                                  height: "200px",
                                  width: "100%",
                                  objectFit: "cover",
                                }}
                                onClick={() =>
                                  setSelectedVideo(
                                    `http://localhost:8081/${pitch.File}`
                                  )
                                }
                              >
                                <source
                                  src={`http://localhost:8081/${pitch.File}`}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                            )}
                            <div className="card-body">
                              <h5 className="card-title">
                                {pitch.pitch_title}
                              </h5>
                              <p className="card-text">
                                {expandedPitch === pitch.id
                                  ? pitch.description
                                  : `${pitch.description.slice(0, 100)}...`}
                                <button
                                  className="btn btn-link"
                                  onClick={() =>
                                    setExpandedPitch(
                                      expandedPitch === pitch.id
                                        ? null
                                        : pitch.id
                                    )
                                  }
                                >
                                  {expandedPitch === pitch.id
                                    ? "Show Less"
                                    : "Read More"}
                                </button>
                              </p>
                              <div className="d-flex justify-content-between mt-3">
                                 <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    handleGoToProfile(pitch.userid)
                                  }
                                >
                                  View Profile
                                </button>
                                <button
                                  className="btn btn-success"
                                  onClick={() =>
                                    handleAccept(pitch, pitch.userid)
                                  }
                                >
                                  Accept
                                </button>
                              </div>
                              <span className="badge bg-danger">Rejected</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12">
                        <p className="text-center">No Rejected pitches found</p>
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

      {selectedVideo && (
        <div className="modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="modal-content">
            <span className="close-btn" onClick={() => setSelectedVideo(null)}>
              ✖
            </span>
            <video controls autoPlay>
              <source src={selectedVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
}

export default Rejected;
