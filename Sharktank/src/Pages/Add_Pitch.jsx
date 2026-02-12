import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";

function Add_Pitch() {
   const [sidebarToggled, setSidebarToggled] = useState(false);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    file: null,
    newCategory: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showNewInput, setShowNewInput] = useState(false);
  
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
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (error) {
        console.error('Error decrypting user data:', error);
        return null;
      }
    };

    const userData = decryptUser(encryptedUser, secretKey);
    setUser(userData);
  }, [navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8081/categories', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name === 'category' && value === 'Add_Categories') {
      setShowNewInput(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('File', formData.file);
      formDataToSend.append('userId', user.id);

      const response = await axios.post('http://localhost:8081/pitch', formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Pitch added successfully!');
      alert('Pitch added successfully!');
      setFormData({ title: '', description: '', category: '', file: null, newCategory: '' });
      navigate('/My_pitches');
    } catch (error) {
      setMessage('Error adding pitch. Please try again.');
      alert('Error adding pitch. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggle = () => {
    setSidebarToggled(!sidebarToggled);
  };

  const handleAddCategory = async () => {
    if (!formData.newCategory.trim()) {
      alert("Please enter a category name.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/Add_categories",
        { category: formData.newCategory },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Category added successfully!");
      setFormData((prevData) => ({ ...prevData, newCategory: "" }));
      setCategories((prevCategories) => [...prevCategories, { id: response.data.id, Categories_name: formData.newCategory }]);
      setShowNewInput(false);
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    }
  };

  return (
    <div className={`app sidebar-mini ${sidebarToggled ? 'sidenav-toggled' : ''}`}>
      <Header handleToggle={handleToggle} />
      <Sidebar />
      <main className="app-content">
        <div className="row">
          <div className="col-md-12">
            <div className="tile">
              <h3 className="text-center bg-primary text-light p-3">Add Pitch</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input className="form-control" type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select className="form-control" name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.Categories_name}>{cat.Categories_name}</option>
                    ))}
                    <option value="Add_Categories">Add Categories</option>
                  </select>
                </div>
                {showNewInput && (
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Enter new category" name="newCategory" value={formData.newCategory} onChange={handleChange} />
                    <button type="button" className="btn btn-primary mt-2" onClick={handleAddCategory}>Add</button>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Upload File</label>
                  <input className="form-control" type="file" name="file" accept="image/*" onChange={handleFileChange} required />
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Add_Pitch;