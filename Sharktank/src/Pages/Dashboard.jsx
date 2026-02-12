import React, { useState } from 'react';
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import DataTable from './DataTable';

function Dashboard() {
  const [sidebarToggled, setSidebarToggled] = useState(false); // State to track sidebar toggle
  
  const handleToggle = () => {
    setSidebarToggled(!sidebarToggled);
  };

  return (
    <>
      <div className={`app sidebar-mini ${sidebarToggled ? 'sidenav-toggled' : ''}`}>
        <Header handleToggle={handleToggle} /> {/* Pass handleToggle as prop */}
        <Sidebar />
        <DataTable />
      </div>
    </>
  );
}

export default Dashboard;
