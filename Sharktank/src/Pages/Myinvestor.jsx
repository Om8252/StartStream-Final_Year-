import React, { useState, useEffect } from "react";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Myinvestor() {
  const [user, setUser] = useState(null);
  const [investorDetails, setInvestorDetails] = useState({});
  const [pitches, setPitches] = useState([]);
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setSidebarToggled(!sidebarToggled);
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
      const fetchAcceptedInvestors = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8081/pitch/${user.id}`
          );
          const data = response.data;

          if (data.success && Array.isArray(data.pitches)) {
            const acceptedPitches = data.pitches.filter((pitch) => pitch.Accept);
            setPitches(acceptedPitches);  // Set accepted pitches here
            const investorIds = acceptedPitches.flatMap((pitch) =>
              pitch.Accept ? pitch.Accept.split(",") : []
            );
            fetchInvestorDetails([...new Set(investorIds)]); // Fetch unique investor IDs
          }
        } catch (error) {
          console.error("Error fetching accepted investors:", error);
        }
      };

      fetchAcceptedInvestors();
    }
  }, [user]);

  const fetchInvestorDetails = async (investorIds) => {
    try {
      const investorData = {};
      for (const id of investorIds) {
        if (!investorDetails[id]) {
          const response = await axios.get(
            `http://localhost:8081/get-user/${id}`
          );
          const { data } = response;
          if (data.success) {
            investorData[id] = data.data;
          }
        }
      }
      setInvestorDetails((prev) => ({ ...prev, ...investorData }));
    } catch (error) {
      console.error("Error fetching investor details:", error);
    }
  };

  return (
    <div
      className={`app sidebar-mini ${sidebarToggled ? "sidenav-toggled" : ""}`}
    >
      <Header handleToggle={handleToggle} />
      <Sidebar />
      <main className="app-content">
        <div className="row">
          <div className="col-md-12">
            <div className="tile">
              <div className="tile-body">
                <h3 className="mb-3">Investor Details</h3>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Investor Name</th>
                      <th>Email</th>
                      <th>Pitch Title</th> {/* Added new column */}
                    </tr>
                  </thead>
                  <tbody>
                    {pitches.length > 0 ? (
                      pitches.map((pitch, index) => {
                        const investorIds = pitch.Accept
                          ? pitch.Accept.split(",")
                          : [];

                        return (
                          <React.Fragment key={index}>
                            {investorIds.map((id) => (
                              <React.Fragment key={id}>
                                {/* Investor details row */}
                                <tr>
                                  <td>
                                    {investorDetails[id]
                                      ? `${investorDetails[id].fname} ${investorDetails[id].lname}`
                                      : "Loading..."}
                                  </td>
                                  <td>
                                    {investorDetails[id]
                                      ? `${investorDetails[id].email}`
                                      : "Loading..."}
                                  </td>
                                  <td> {pitch.pitch_title}</td> {/* Empty cell for the first row */}
                                </tr>

                              
                              </React.Fragment>
                            ))}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No investors found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Myinvestor;
