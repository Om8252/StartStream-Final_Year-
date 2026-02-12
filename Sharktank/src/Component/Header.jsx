import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js'; // Ensure you have CryptoJS imported
import 'bootstrap/dist/js/bootstrap.bundle.min';

import NotificationComponent from '../Pages/NotificationComponent';

function Header({ handleToggle }) {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the backend logout route if needed (optional)
      await fetch('/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error logging out:', error);
    }

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('secretKey');

    // Redirect to the login page
    navigate('/');
  };

  const isLoggedIn = !!localStorage.getItem('token'); // Check if token exists
  const secretKey = localStorage.getItem('secretKey');
  const encryptedUser = localStorage.getItem('user');

  let user = null;
  if (encryptedUser && secretKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedUser, secretKey);
    try {
      user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)); // Decrypt and parse user data
    } catch (e) {
      console.error('Error parsing decrypted user data:', e);
    }
  }

  return (
    <header className="app-header">
      <a className="app-header__logo" href="#">StartStream</a>
      <button className="app-sidebar__toggle" onClick={handleToggle} aria-label="Hide Sidebar"></button>
      <ul className="app-nav">
        {isLoggedIn && user ? (
          <>
          {/* here is notification */}
          {/* <NotificationComponent/> */}

          <li className="dropdown">
            <a className="app-nav__item" href="#" data-bs-toggle="dropdown" aria-label="Open Profile Menu">
            {user.fname}<i className="bi bi-person fs-4"></i> 
            </a>
            <ul className="dropdown-menu settings-menu dropdown-menu-right">
              <li><NavLink className="dropdown-item" to="/profile"><i className="bi bi-person me-2 fs-5"></i> Profile</NavLink></li>
              {/* <li><NavLink className="dropdown-item" to="/settings"><i className="bi bi-gear me-2 fs-5"></i> Settings</NavLink></li> */}
              <li><button className="dropdown-item" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2 fs-5"></i> Logout</button></li>
            </ul>
          </li>
          
            </>
        ) : (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Register">Register</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Login">
                <i className="fa fa-user" aria-hidden="true"></i> Login
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
