import React, { useEffect, useState } from 'react';
import { useNavigate,NavLink } from 'react-router-dom';
// import {  } from 'react-router-dom';
import CryptoJS from 'crypto-js';

function Sidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const encryptedUser = localStorage.getItem('user');
    const secretKey = localStorage.getItem('secretKey');

    if (!token || !encryptedUser || !secretKey) {
      navigate('/');
      return;
    }

    const decryptUser = (encryptedData, key) => {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, key);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
      } catch (error) {
        console.error('Error decrypting user data:', error);
        return null;
      }
    };

    const userData = decryptUser(encryptedUser, secretKey);
    setUser(userData);
  }, [navigate]);

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__user">
        <img
          className="app-sidebar__user-avatar"
          src={user &&  user.Profile ? `http://localhost:8081${user.Profile}` : `https://randomuser.me/api/portraits/men/1.jpg`}
          
          alt="User"
        />
        <div>
          <p className="app-sidebar__user-name">{user ? user.role : 'User'}</p>
        </div>
      </div>
      <ul className="app-menu">
        <li>
          <NavLink className="app-menu__item" to='/dashboard'>
            <i className="app-menu__icon bi bi-speedometer"></i>
            <span className="app-menu__label">Dashboard</span>
          </NavLink>
        </li>
        {user && user.role === 'Investor' && (
          <>
            <li>
              <NavLink className="app-menu__item" to='/All_pitch'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">All Pitches</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="app-menu__item" to='/Accpted'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">Accpted</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="app-menu__item" to='/Rejected'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">Rejected</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="app-menu__item" to='/Myseaker'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">My Seaker</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="app-menu__item" to='/Message'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">Messages</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="app-menu__item" to='/Payments'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">Payments</span>
              </NavLink>
            </li>
          </>
        )} 

        {user && user.role === 'InvestorSeaker' && (
          <>
            <li>
              <NavLink className="app-menu__item" to='/My_Pitches'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">My Pitches</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="app-menu__item" to='/Add_Pitch'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">Add Pitches</span>
              </NavLink>
            </li>
        
         
            <li>
              <NavLink className="app-menu__item" to='/Myinvestor'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">My Investor</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="app-menu__item" to='/Message'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">Messages</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="app-menu__item" to='/Payments'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">Payments</span>
              </NavLink>
            </li>
          </>
        )}

        {user && user.role === 'admin' && (
          <>
            <li>
              <NavLink className="app-menu__item" to='/All_Users'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">All Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="app-menu__item" to='/All_Investor'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">Investor</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="app-menu__item" to='/All_Seaker'>
                <i className="app-menu__icon bi bi-trophy-fill"></i>
                <span className="app-menu__label">Investor Seaker  </span>
              </NavLink>
            </li>
         
           
          </>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
