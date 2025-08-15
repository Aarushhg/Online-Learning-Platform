import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // context import
import './Header.css';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useAuth(); // 🔥 use AuthContext here

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleDashboard = () => setDashboardOpen(!dashboardOpen);

  useEffect(() => {
    if (user?.name) {
      const firstName = user.name.split(' ')[0];
      setUserName(firstName);
    } else {
      setUserName('');
    }
  }, [user]);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const handleDarkModeToggle = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode);
      document.body.classList.toggle('dark-mode', newMode);
      return newMode;
    });
  };

  const handleDashboardClick = () => {
    if (user?.role === 'student') navigate('/dashboard/student');
    else if (user?.role === 'instructor') navigate('/dashboard/instructor');
  };

  return (
    <>
      <header className="main-header">
        <div className="left-section">
          <div className="hamburger" onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="logo-title">
            <Link to="/" className="title-link">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png"
                alt="logo"
                className="header-logo"
              />
              <h1 className="site-title">LearnPro</h1>
            </Link>
          </div>
        </div>

        <nav className="nav-links">
          <button className="dark-mode-toggle" onClick={handleDarkModeToggle}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <Link to="/courses">Courses</Link>
          <Link to="/live-classes" className="live">Live</Link>
          <Link to="/profile" className="profile">Profile</Link>


          {userName && (
            <span className="welcome-text">Welcome! {userName}</span>
          )}

          {userName ? (
            <img
              src={
                user?.profilePic
                  ? `http://localhost:5000${user.profilePic}`
                  : 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png'
              }
              alt="Profile"
              className="nav-profile-pic"
              onClick={() => navigate('/profile')}
              onError={(e) => {
                e.target.src =
                  'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png';
              }}
            />
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={closeSidebar}>×</button>

        {user?.role === 'admin' ? (
          <div className="dropdown">
            <button className="dropdown-btn" onClick={toggleDashboard}>Dashboard</button>
            {dashboardOpen && (
              <div className="dropdown-content">
                <Link to="/dashboard/admin" onClick={closeSidebar}>Admin</Link>
                <Link to="/dashboard/student" onClick={closeSidebar}>Student</Link>
                <Link to="/dashboard/instructor" onClick={closeSidebar}>Instructor</Link>
              </div>
            )}
          </div>
        ) : (
          user?.role && (
            <button className="sidebar-link-btn" onClick={() => {
              handleDashboardClick();
              closeSidebar();
            }}>
              Dashboard
            </button>
          )
        )}

        <Link to="/discussion" onClick={closeSidebar}>Discussion Forum</Link>
        <Link to="/comments" onClick={closeSidebar}>Comments Page</Link>
        <Link to="/notifications" onClick={closeSidebar}>Notification</Link>
        <Link to="/cart" onClick={closeSidebar}>Cart</Link>
        <Link to="/about" onClick={closeSidebar}>About</Link>
        <Link to="/help" onClick={closeSidebar}>Help</Link>
        <Link to="/terms" onClick={closeSidebar}>Terms</Link>
      </div>
    </>
  );
};

export default Header;
