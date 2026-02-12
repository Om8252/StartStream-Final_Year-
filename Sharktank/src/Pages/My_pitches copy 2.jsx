import React, { useState, useEffect } from "react";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";

import CryptoJS from "crypto-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function My_pitches() {
  const [user, setUser] = useState(null);
  const [pitches, setPitches] = useState([]); // State for pitch data
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [sidebarToggled, setSidebarToggled] = useState(false); // State to track sidebar toggle
  const navigate = useNavigate();
  const [expandedPitch, setExpandedPitch] = useState(null);

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

  // Fetch pitch data from the API using axios
  useEffect(() => {
    if (user) {
      const fetchPitches = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8081/pitch/${user.id}`
          );
          const data = response.data;

          // Log the data to verify its structure
          console.log("Fetched data:", data);

          // Check if 'data.pitches' exists and is an array
          if (data.success && Array.isArray(data.pitches)) {
            setPitches(data.pitches); // Set pitch data properly
          } else {
            console.error("Expected 'pitches' array, but got:", data);
            setPitches([]); // In case of error, set an empty array
          }
        } catch (error) {
          console.error("Error fetching pitch data:", error);
        }
      };

      fetchPitches();
    }
  }, [user]); // Dependency array includes 'user' to refetch when the user data changes

  // Filter pitches based on the search term
  const filteredPitches = pitches.filter((pitch) =>
    `${pitch.pitch_title}${pitch.description}${pitch.category}${pitch.File}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Function to determine if the file is an image or video based on file extension
  const isImage = (fileName) => {
    return /(\.jpg|\.jpeg|\.png|\.gif)$/i.test(fileName);
  };

  const isVideo = (fileName) => {
    return /(\.mp4|\.webm|\.ogg)$/i.test(fileName);
  };

  return (
    <>
      <div
        className={`app sidebar-mini ${sidebarToggled ? "sidenav-toggled" : ""
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

                            <div className="card-text d-flex justify-content-between align-items-center">
                              <p className="fs-5 ms-2 mt-1"><b>{pitch.username}</b></p>

                              {/* Three-dot dropdown menu */}
                              <div className="dropdown">
                                <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                  ⋮
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                  <li><button className="dropdown-item">Edit</button></li>
                                  <li><button className="dropdown-item">Delete</button></li>
                                  <li><button className="dropdown-item">View</button></li>
                                </ul>
                              </div>
                            </div>




                            {/* Display image if file is an image */}
                            {isImage(pitch.File) && (
                              <img
                                src={`http://localhost:8081/${pitch.File}`}
                                className="card-img-top"
                                alt={pitch.pitch_title}
                              />
                            )}

                            {/* Display video if file is a video */}
                            {isVideo(pitch.File) && (
                              <div className="card-img-top">
                                <video controls width="100%">
                                  <source
                                    src={`http://localhost:8081/${pitch.File}`}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            )}

                            <div className="card-body">
                              <h5 className="card-title">
                                {pitch.pitch_title}
                              </h5>
                              <p className="card-text">
                                {expandedPitch === pitch.id
                                  ? pitch.description
                                  : pitch.description
                                    .split(" ")
                                    .slice(0, 10) // Limit to a certain number of words to represent one line
                                    .join(" ") + "..."}
                                {pitch.description.split(" ").length > 10 && (
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
                                )}
                              </p>

                              {/* Display video if available */}
                              {pitch.video && (
                                <div className="mt-3">
                                  <h6>Video:</h6>
                                  <video controls width="100%">
                                    <source
                                      src={`http://localhost:8081/${pitch.video}`}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              )}

                              <div className="d-flex justify-content-between mt-3">
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
        </main>
      </div>
    </>
  );
}

export default My_pitches;
