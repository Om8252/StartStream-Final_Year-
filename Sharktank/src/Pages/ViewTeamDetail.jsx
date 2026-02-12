import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

function ViewTeamDetail() {
  const serverUrl = "https://ndca.onrender.com";
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarToggled, setSidebarToggled] = useState(false); // State to track sidebar toggle
  const [team, setTeam] = useState({
    team_name: '',
    team_logo: null,
    captain_name: '',
    contact_number: '',
    email: '',
    aadhaar_number: '',
    username: '',
    password: ''
  });

  // Check if user is logged in
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/Admin'); // Redirect to login page if not logged in
    }
  }, [navigate]);

  // Fetch team details based on ID from the URL
  useEffect(() => {
    fetch(`${serverUrl}/get-team/${id}`)
      .then(response => response.json())
      .then(data => setTeam(data))
      .catch(error => console.error('Error fetching team:', error));
  }, [id]);
  const handleToggle = () => {
    setSidebarToggled(!sidebarToggled);
  };
  return (
    <>
         <div className={`app sidebar-mini ${sidebarToggled ? 'sidenav-toggled' : ''}`}>
        <Header handleToggle={handleToggle} /> {/* Pass handleToggle as prop */}
      <Sidebar />
      <main className="app-content">
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8 pt-3">
            <div className="tile">
              <div className="row">
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="Logo"><b>Team Logo</b></label>
                    {team.team_logo && (
                      <div className="mb-1">
                        <img src={`${serverUrl}${team.team_logo}`} alt="Team Logo" className="img-thumbnail" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-8 p-4">
                  <div className="mb-3">
                    <label className="fw-bold" htmlFor="teamName">Team Name: &nbsp;</label>
                    <span className="text-primary">{team.team_name}</span>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold" htmlFor="captainName">Captain Name: &nbsp;</label>
                    <span className="text-primary">{team.captain_name}</span>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold" htmlFor="contactNumber">Contact Number: &nbsp;</label>
                    <span className="text-primary">{team.contact_number}</span>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold" htmlFor="email">Email: &nbsp;</label>
                    <span className="text-primary">{team.email}</span>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold" htmlFor="aadhaarNumber">Aadhaar Number: &nbsp;</label>
                    <span className="text-primary">{team.aadhaar_number}</span>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold" htmlFor="username">Username: &nbsp;</label>
                    <span className="text-primary">{team.username}</span>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold" htmlFor="password">Password: &nbsp;</label>
                    <span className="text-primary">{team.password}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
      </main>
      </div>
    </>
  );
}

export default ViewTeamDetail;
