import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">EduPlatform</h2>
      <ul className="sidebar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/mycourses">My Courses</Link></li>
        <li><Link to="/live-classes">Live Classes</Link></li>
        <li><Link to="/progress">Progress</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
        <li><Link to="/discussion">Forum</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
