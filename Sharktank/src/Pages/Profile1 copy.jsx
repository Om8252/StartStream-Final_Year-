import React, { useState, useEffect } from "react";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams

function Profile1() {
  const [user, setUser] = useState(null);
  const [pitches, setPitches] = useState([]); // State for pitch data
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [sidebarToggled, setSidebarToggled] = useState(false); // Sidebar toggle state
  const [expandedPitch, setExpandedPitch] = useState(null); // Track expanded pitch
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const {id } = useParams(); // Get the user ID from the URL

  const handleToggle = () => {
    setSidebarToggled(!sidebarToggled);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const encryptedUser = localStorage.getItem("user");
    const secretKey = localStorage.getItem("secretKey");

    if (!token || !encryptedUser || !secretKey) {
      navigate("/"); // Redirect to home if not logged in
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
      setUser(decryptedUser); // Set user after successful decryption
    } else {
      navigate("/"); // Redirect if decryption fails
    }
  }, [navigate]);

  useEffect(() => {
    if (!id) return; // Ensure id is available

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/get-user/${id}`);
        if (response.data.success) {
          setUser(response.data.user); // Set the fetched user profile
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [id]);
 
  
  
  useEffect(() => {
    if (!user) return;

    const fetchPitches = async () => {
      try {
        let response;

        if (user.role === "Investor") {
          // Fetch all pitches if user is an investor
          response = await axios.get("http://localhost:8081/pitchg");
          if (response.data.success) {
            const userId = user.id.toString();
            setPitches(
              response.data.pitches
                .map((pitch) => {
                  const acceptedIds = pitch.Accept
                    ? pitch.Accept.split(",")
                    : [];
                  return {
                    ...pitch,
                    status: acceptedIds.includes(userId) ? "Accepted" : "",
                  };
                })
                .filter((pitch) => pitch.status === "Accepted") // Show only accepted pitches
            );
          }
        } else {
          // Fetch only the user's pitches if they are an Investor Seeker
          response = await axios.get(`http://localhost:8081/pitch/${id}`);
          if (response.data.success && Array.isArray(response.data.pitches)) {
            setPitches(response.data.pitches);
          }
        }
      } catch (error) {
        console.error("Error fetching pitch data:", error);
      }
    };

    fetchPitches();
  }, [user]);

  const filteredPitches = pitches.filter((pitch) =>
    `${pitch.pitch_title}${pitch.description}${pitch.category}${pitch.File}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const isImage = (fileName) => /(\.jpg|\.jpeg|\.png|\.gif)$/i.test(fileName);
  const isVideo = (fileName) => /(\.mp4|\.webm|\.ogg)$/i.test(fileName);

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
          <div className="container-fluid">
          
            <div className="row mb-4">
              {/* Updated User Information Section */}
              <div className="col-md-12">
                <div className="card shadow-sm">
                  <h1 className="text-center text-primary mt-3">Profile</h1>
                  <hr />
                  <div className="card-body d-flex align-items-center">
                    {/* Profile Image */}
                    {user && user.Profile ? (
                      <img
                        src={`http://localhost:8081${user.Profile}`}
                        alt="Profile"
                        className="img-fluid rounded-circle mr-4 My_profile"
                        onClick={() =>
                          setSelectedImage(
                            `http://localhost:8081${user.Profile}`
                          )
                        }
                      />
                    ) : (
                      <div className="bg-secondary rounded-circle My_profile mr-4"></div>
                    )}
                    <div
                      className="vr"
                      style={{
                        width: "0.2vw",
                        backgroundColor: "#000",
                        height: "50vh",
                        margin: "0 4vw",
                      }}
                    ></div>
                    {/* User Details */}
                    {user ? (
                      <div className="Profile">
                        <p className=" name text-primary">
                          {user.fname} {user.mname} {user.lname}
                        </p>
                        <p>
                          <b className="text-primary">Username:</b>{" "}
                          {user.Username}
                        </p>
                        <p>
                          <b className="text-primary">Email:</b> {user.email}
                        </p>
                        <p>
                          <b className="text-primary">Phone:</b> {user.Phone}
                        </p>
                        <p>
                          <b className="text-primary">Role:</b> {user.role}
                        </p>
                      </div>
                    ) : (
                      <p>Loading user information...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pitches Section */}
            <div className="row">
              <div className="col-md-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h1 className="text-center text-primary mb-4">
                      My Pitches
                    </h1>
                    <hr />
                    <div className="row">
                      {filteredPitches.length > 0 ? (
                        filteredPitches.map((pitch) => (
                          <div className="col-md-4 mb-4" key={pitch.id}>
                            <div className="card h-100">
                              {isImage(pitch.File) && (
                                <img
                                  src={`http://localhost:8081/${pitch.File}`}
                                  className="card-img-top img-fluid hover-zoom"
                                  alt={pitch.pitch_title}
                                  style={{
                                    height: "200px",
                                    objectFit: "cover",
                                  }}
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
                              <div className="card-body d-flex flex-column">
                                <h5 className="card-title">
                                  {pitch.pitch_title}
                                </h5>
                                <p className="card-text flex-grow-1">
                                  {expandedPitch === pitch.id
                                    ? pitch.description
                                    : pitch.description
                                        .split(" ")
                                        .slice(0, 10)
                                        .join(" ") + "..."}
                                  {pitch.description.split(" ").length > 10 && (
                                    <button
                                      className="btn btn-link p-0"
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
                                  )}
                                </p>
                                <div className="mt-3">
                                  <button className="btn btn-info">
                                    View Details
                                  </button>
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

export default Profile1;