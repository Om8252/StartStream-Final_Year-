import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import CryptoJS from 'crypto-js';

function All_Users() {
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
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
    axios.get('http://localhost:8081/users')
      .then(response => {
        setUsers(response.data.users);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

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
    <div className={`app sidebar-mini ${sidebarToggled ? 'sidenav-toggled' : ''}`}>
      <Header handleToggle={handleToggle} />
      <Sidebar />
      <main className="app-content background">
        <div className="col-md-12">
          <div className="tile">
            <div className="tile-body">
              <div className="table-responsive">
                <table className="table table-hover table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{`${user.fname} ${user.mname} ${user.lname}`}</td>
                        <td>{user.role}</td>
                        <td>{user.email}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-3"
                            onClick={() => handleEdit(user.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default All_Users;
