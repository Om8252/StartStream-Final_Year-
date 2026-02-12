import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Pages/css/DataTable.css';
import CryptoJS from 'crypto-js'; // Ensure you have CryptoJS imported

function DataTable() {
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [pitchCount, setPitchCount] = useState(0);
  const [InvestorCount, setInvestorCount] = useState(0);
  const [SeakerCount, setSeakerCount] = useState(0);


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


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Handle case if token doesn't exist, e.g., redirect to login page
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch the user count and pitch count from the backend
        const userResponse = await axios.get('http://localhost:8081/userCount', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setUserCount(userResponse.data.SeakerCount + userResponse.data.InvestorCount); // Adjust according to your data structure
        setInvestorCount(userResponse.data.InvestorCount);
        setSeakerCount(userResponse.data.SeakerCount);
        const pitchResponse = await axios.get('http://localhost:8081/pitchCount', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setPitchCount(pitchResponse.data.pitchCount);

        // Fetch other counts like likes, uploads, stars if available
        // For now, we are using placeholder values.


      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="app-content background">




{isLoggedIn && user && user.role === "admin"? (
          <>
          <div className="row">
        <div className="col-md-7 col-lg-3">
          <div className="widget-small primary coloured-icon">
            <i className="icon bi bi-people fs-1"></i>
            <div className="info">
              <h4>Users</h4>
              <p><b>{userCount}</b></p>
            </div>
          </div>
        </div>

        <div className="col-md-7 col-lg-3">
          <div className="widget-small primary coloured-icon">
            <i className="icon bi bi-people fs-1"></i>
            <div className="info">
              <h4>All Pitches</h4>
              <p><b>{pitchCount}</b></p>
            </div>
          </div>
        </div>

        <div className="col-md-7 col-lg-3">
          <div className="widget-small primary coloured-icon">
            <i className="icon bi bi-people fs-1"></i>
            <div className="info">
              <h4>Investor </h4>
              <p><b>{InvestorCount}</b></p>
            </div>
          </div>
        </div>
        <div className="col-md-7 col-lg-3">
          <div className="widget-small primary coloured-icon">
            <i className="icon bi bi-people fs-1"></i>
            <div className="info">
              <h4>Investor Seaker </h4>
              <p><b>{SeakerCount}</b></p>
            </div>
          </div>
        </div>

      </div>
          
            </>
        ) : (
          <>
            
          </>
        )}

        {isLoggedIn && user && user.role === "Investor"? (
          <>
          <div className="row">
        <div className="col-md-7 col-lg-4">
          <div className="widget-small primary coloured-icon">
            <i className="icon bi bi-people fs-1"></i>
            <div className="info">
              <h4>Users</h4>
              <p><b>{userCount}</b></p>
            </div>
          </div>
        </div>

        <div className="col-md-7 col-lg-4">
          <div className="widget-small primary coloured-icon">
            <i className="icon bi bi-people fs-1"></i>
            <div className="info">
              <h4>All Pitches</h4>
              <p><b>{pitchCount}</b></p>
            </div>
          </div>
        </div>

       
        <div className="col-md-7 col-lg-4">
          <div className="widget-small primary coloured-icon">
            <i className="icon bi bi-people fs-1"></i>
            <div className="info">
              <h4>Investor Seaker </h4>
              <p><b>{SeakerCount}</b></p>
            </div>
          </div>
        </div>

      </div>
          
            </>
        ) : (
          <>
            
          </>
        )}

        {isLoggedIn && user && user.role === "InvestorSeaker"? (
          <>
          <div className="row">
        <div className="col-md-7 col-lg-4">
          <div className="widget-small primary coloured-icon">
            <i className="icon bi bi-people fs-1"></i>
            <div className="info">
              <h4>Users</h4>
              <p><b>{userCount}</b></p>
            </div>
          </div>
        </div>

        <div className="col-md-7 col-lg-4">
          <div className="widget-small primary coloured-icon">
            <i className="icon bi bi-people fs-1"></i>
            <div className="info">
              <h4>All Pitches</h4>
              <p><b>{pitchCount}</b></p>
            </div>
          </div>
        </div>

       
        <div className="col-md-7 col-lg-4">
          <div className="widget-small primary coloured-icon">
            <i className="icon bi bi-people fs-1"></i>
            <div className="info">
              <h4>Investor Seaker </h4>
              <p><b>{SeakerCount}</b></p>
            </div>
          </div>
        </div>

      </div>
          
            </>
        ) : (
          <>
            
          </>
        )}






     
    </main>
  );
}

export default DataTable;
