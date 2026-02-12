import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";

function Edit_User() {
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
     fname: '',
    mname: '',
    lname: '',
    email: '',
    password: '',
    role: '', // Add password to formData
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
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

    const userData = decryptUser(encryptedUser, secretKey);
    setUser(userData);
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8081/get-user/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFormData(response.data.data);
        setMessage("");
      } catch (error) {
        setMessage("Error fetching user data");
        console.error("Error fetching user data:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

 

  const handleToggle = () => {
    setSidebarToggled(!sidebarToggled);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedFormData = { ...formData };
    if (!updatedFormData.password) {
      delete updatedFormData.password;
    }
  
    try {
      const response = await axios.put(`http://localhost:8081/update-user/${id}`, updatedFormData);
      if (response.data.success) {
        window.alert("User updated successfully!"); // Show success alert
        navigate('/All_Users'); // Navigate after alert
      } else {
        setMessage(response.data.message || "Error updating user");
      }
    } catch (error) {
      setMessage("Error updating user");
      console.error("Error updating user:", error.response || error);
    }
  };
  

  return (
    <div className={`app sidebar-mini ${sidebarToggled ? "sidenav-toggled" : ""}`}>
      <Header handleToggle={handleToggle} />
      <Sidebar />
      <main className="app-content">
        <div className="row">
          <div className="col-md-12">
            <div className="tile">
              <h3 className="text-center bg-primary text-light p-3">Edit User</h3>
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      className="form-control"
                      type="text"
                      id="fname"
                            name="fname"
                            
                      value={formData.fname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Middle Name</label>
                    <input
                      className="form-control"
                      type="text"
                      id="mname"
                            name="mname"
                      value={formData.mname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      className="form-control"
                      type="text"
                       id="lname"
                            name="lname"
                      value={formData.lname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      id="email"
                          name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-control"
                      type="text"
                      name="phone"
                      value={formData.Phone}
                      onChange={handleChange}
                    />
                  </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                          className="form-control"
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Role</option>
                          <option value="Investor">Investor</option>
                          <option value="InvestorSeaker">Seaker</option>
                        </select>
                      </div>
              
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      className="form-control"
                      type="password"
                      name="password"
                  
                      onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </form>
              )}
              {message && <p className="text-danger mt-3">{message}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Edit_User;
