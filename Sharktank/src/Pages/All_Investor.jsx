import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import CryptoJS from 'crypto-js';
    function All_Investor() {
        const [sidebarToggled, setSidebarToggled] = useState(false);
        const [users, setUsers] = useState([]);
        const [user, setUser] = useState(null)
        const navigate = useNavigate(); // Initialize navigate
      
        const handleToggle = () => {
          setSidebarToggled(!sidebarToggled);
        };
      
        
      
        const handleEdit = (userId) => {
          // Navigate to the edit page with the userId
          navigate(`/edit-user/${userId}`);
        };
      
        const handleDelete = async (userId) => {
          // Confirm deletion
          if (window.confirm('Are you sure you want to delete this User?')) {
            try {
              await axios.delete(`http://localhost:8081/delete-user/${userId}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
              });
              // Fetch updated users list
              const updatedUsers = users.filter(user => user.id !== userId);
              setUsers(updatedUsers);
              alert('User deleted successfully!'); // Replace with your notification method
            } catch (error) {
              console.error('Error deleting user:', error);
              alert('Error deleting user. Please try again.'); // Optionally, show error feedback
            }
          }
        };
      
       
      
        useEffect(() => {
          const token = localStorage.getItem('token');
          const encryptedUser = localStorage.getItem('user');
          const secretKey = localStorage.getItem('secretKey');
      
          if (!token || !encryptedUser || !secretKey) {
            navigate('/'); // Redirect to home if not logged in
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
      
          const fetchUsers = async () => {
            try {
              const response = await axios.get('http://localhost:8081/users', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
      
              setUsers(response.data.users);
            } catch (error) {
              console.error('Error fetching users:', error);
            }
          };
      
          fetchUsers();
        }, [navigate]);

    return (
        <>
        <div className={`app sidebar-mini ${sidebarToggled ? 'sidenav-toggled' : ''}`}>
            <Header handleToggle={handleToggle} /> {/* Pass handleToggle as prop */}
            <Sidebar />
            <main className="app-content background">
            <div className="col-md-12">
                <div className="tile">
                <div className="tile-body">
                    <div className="table-responsive">
                    <div
                        id="sampleTable_wrapper"
                        className="dataTables_wrapper dt-bootstrap5 no-footer"
                    >
                        <div className="row">
                        <div className="col-sm-12 col-md-6">
                            <div className="dataTables_length" id="sampleTable_length">
                            <label>
                                Show{" "}
                                <select
                                name="sampleTable_length"
                                aria-controls="sampleTable"
                                className="form-select form-select-sm"
                                >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                </select>{" "}
                                entries
                            </label>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <div id="sampleTable_filter" className="dataTables_filter">
                            <label>
                                Search:
                                <input
                                type="search"
                                className="form-control form-control-sm"
                                placeholder=""
                                aria-controls="sampleTable"
                                />
                            </label>
                            </div>
                        </div>
                        </div>
                        <div className="row dt-row">
                        <div className="col-sm-12">
                            <table
                            className="table table-hover table-bordered dataTable no-footer"
                            id="sampleTable"
                            aria-describedby="sampleTable_info"
                            >
                            <thead>
                                <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Email</th>
                                <th>Actions</th> {/* New Actions column */}
                                </tr>
                            </thead>
                            <tbody>
                                {users.filter(user =>user.role === "Investor").map(user => (
                                <tr key={user.id}>
                                    <td>{`${user.fname} ${user.mname} ${user.lname}`}</td>
                                    <td>{user.role}</td>
                                    <td>{user.email}</td>
                                    <td >
                                    <button
                                        className="btn btn-warning btn-sm me-3"
                                        onClick={() => handleEdit(user.id)}
                                    >
                                        Edit
                                    </button>

                                    <span className='ml-3'>
                                    <button
                                        className="btn btn-danger btn-sm   "
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                    </span>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </main>
        </div>
        </>
    );
    }

    export default All_Investor;
