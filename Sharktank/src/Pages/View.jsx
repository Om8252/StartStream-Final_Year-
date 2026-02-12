import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "./Header";
import Sidebar from "./Sidebar";

function View() {
    const serverUrl = "https://ndca.onrender.com";
    const { id } = useParams(); // Get the ID from the URL
    const [sidebarToggled, setSidebarToggled] = useState(false); // State to track sidebar toggle
    const handleToggle = () => {
    setSidebarToggled(!sidebarToggled);
  };
    const [tournament, setTournament] = useState({
        age_group: '',
        name: '',
        format: '',
        start_date: '',
        end_date: '',
        number_of_teams: '',
        logo: null,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/Admin'); // Redirect to login page if not logged in
            return; // Exit early if redirecting
        }

        // Fetch tournament data based on the ID
        fetch(`${serverUrl}/get-tournament/${id}`)
            .then(response => response.json())
            .then(data => setTournament(data))
            .catch(error => console.error('Error fetching tournament:', error));
    }, [id, navigate]);

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
                                        {tournament.logo && (
                                            <div className="mb-1">
                                                <img
                                                    src={`${serverUrl}${tournament.logo}`}
                                                    alt="Current Tournament Logo"
                                                    className="img-thumbnail"
                                                    style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-8 p-4">
                                    <div className="mb-3">
                                        <label className="fw-bold" htmlFor="ageGroup">Tournaments Age Groups: &nbsp;</label>
                                        <span className="text-primary">{tournament.age_group}</span>
                                    </div>
                                    <div className="mb-3">
                                        <label className="fw-bold" htmlFor="ageGroup">Tournaments Name: &nbsp;</label>
                                        <span className="text-primary">{tournament.name}</span>
                                    </div>
                                    <div className="mb-3">
                                        <label className="fw-bold" htmlFor="ageGroup">Format: &nbsp;</label>
                                        <span className="text-primary">{tournament.format}</span>
                                    </div>
                                    <div className="mb-3">
                                        <label className="fw-bold" htmlFor="ageGroup">Start Date: &nbsp;</label>
                                        <span className="text-primary">{tournament.start_date.split('T')[0]}</span>
                                    </div>
                                    <div className="mb-3">
                                        <label className="fw-bold" htmlFor="ageGroup">End Date: &nbsp;</label>
                                        <span className="text-primary">{tournament.end_date.split('T')[0]}</span>
                                    </div>
                                    <div className="mb-3">
                                        <label className="fw-bold" htmlFor="ageGroup">Number of Teams: &nbsp;</label>
                                        <span className="text-primary">{tournament.number_of_teams}</span>
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

export default View;
