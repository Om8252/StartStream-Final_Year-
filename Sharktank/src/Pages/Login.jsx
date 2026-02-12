import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import axios from 'axios';  // Import axios for making API calls
import CryptoJS from 'crypto-js';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Generate secret key
  const generateSecretKey = (length) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let key = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      key += charset[randomIndex];
    }
    return key;
  };

  const secretKey = generateSecretKey(32); // Secure random key

  // Redirect to Dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/Dashboard');
    }
  }, [navigate]);

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8081/Login', {
        identifier: username,  // Using username as email
        password: password,
      });

      if (response.data.token) {
        const encryptedUser = CryptoJS.AES.encrypt(
          JSON.stringify(response.data.user),
          secretKey  // Use the generated secret key
        ).toString();

        // Store token and user details in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', encryptedUser);
        localStorage.setItem('secretKey', secretKey);

        alert('Login successful');

        // Redirect to Dashboard after login
        navigate('/Dashboard');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrorMessage('Invalid username or password');
      } else {
        setErrorMessage('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <div>
      <section className="material-half-bg">
        <div className="cover"></div>
      </section>

      <section className="login-content">
        <div className="logo">
          <h1>Welcome to StartStream</h1>
        </div>
        <div className="login-box">
          <form className="login-form" onSubmit={handleLogin}>
            <h3 className="login-head"><i className="bi bi-person me-2"></i>SIGN IN</h3>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div className="mb-3">
              <label className="form-label">Email Or Username</label>
              <input
                className="form-control"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3 btn-container d-grid">
              <button className="btn btn-primary btn-block">
                <i className="bi bi-box-arrow-in-right me-2 fs-5"></i>SIGN IN
              </button>
            </div>
            <div className="text-center">
              <p>Don't have an account? <NavLink to="/register">Register here</NavLink></p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
