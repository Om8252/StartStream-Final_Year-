import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";

function Myseaker() {
    const [pitches, setPitches] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [user, setUser] = useState(null);
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

        axios.get("http://localhost:8081/pitchg")
            .then((response) => {
                if (response.data.success) {
                    const userId = user.id.toString();
                    setPitches(
                        response.data.pitches.map((pitch) => {
                            const acceptedIds = pitch.Accept ? pitch.Accept.split(",") : [];
                            return {
                                ...pitch,
                                status: acceptedIds.includes(userId) ? "Accepted" : ""
                            };
                        }).filter(pitch => pitch.status === "Accepted") // Only accepted pitches
                    );
                } else {
                    console.error("Error fetching pitches:", response.data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching pitches:", error);
            });
    }, [user]);

    const filteredPitches = pitches.filter((pitch) =>
        `${pitch.pitch_title}${pitch.userId}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`app sidebar-mini ${sidebarToggled ? 'sidenav-toggled' : ''}`}>
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
                                                placeholder="Search by username or pitch title"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Display Table for Usernames and Pitch Titles */}
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>Pitch Title</th>
                                                <th>Username</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPitches.length > 0 ? (
                                                filteredPitches.map((pitch, index) => (
                                                    <tr key={index}>
                                                        <td>{pitch.pitch_title}</td>
                                                        <td>{pitch.username}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="2" className="text-center">
                                                        No accepted pitches found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Myseaker;
