import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Register() {
  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [lname, setLname] = useState("");
  const [Phone, setPhone] = useState("");
  const [Username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("Username", Username);
    formData.append("fname", fname);
    formData.append("mname", mname);
    formData.append("lname", lname);
    formData.append("Phone", Phone);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }

    // Send data to backend
    try {
      const response = await axios.post(
        "http://localhost:8081/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Registration successful!");
        navigate("/");
      } else {
        setErrorMessage(
          response.data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error registering, please try again."
      );
    }
  };

  return (
    <div>
      <section className="material-half-bg">
        <div className="cover"></div>
      </section>

      <section className="login-content">
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="col-lg-10 col-md-8 col-sm-10">
            <div className="card p-4">
              <h2 className="text-center">Register</h2>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              <form onSubmit={handleRegister}>
                <div className="form-group row">
                  <div className="col-md-4">
                    <label htmlFor="fname">First Name</label>
                    <input
                      type="text"
                      id="fname"
                      className="form-control"
                      value={fname}
                      onChange={(e) => setFname(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="mname">Middle Name</label>
                    <input
                      type="text"
                      id="mname"
                      className="form-control"
                      value={mname}
                      onChange={(e) => setMname(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="lname">Last Name</label>
                    <input
                      type="text"
                      id="lname"
                      className="form-control"
                      value={lname}
                      onChange={(e) => setLname(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="profilePhoto">Profile Photo</label>
                  <input
                    type="file"
                    id="profilePhoto"
                    className="form-control"
                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                    accept="image/*"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="Phone">Phone</label>
                  <input
                    type="number"
                    id="Phone"
                    className="form-control"
                    value={Phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Username">Username</label>
                  <input
                    type="text"
                    id="Username"
                    className="form-control"
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    className="form-control"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Investor">Investor</option>
                    <option value="InvestorSeaker">Seeker</option>
                  </select>
                </div>
                <div className="form-group text-center">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;
