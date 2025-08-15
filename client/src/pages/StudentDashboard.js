import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

    // ✅ Redirect to login if not authenticated
  useEffect(() => {
  const token = localStorage.getItem('token');
  console.log('TOKEN CHECK:', token);

  if (!token) {
    alert('You are not logged in! Redirecting...');
    navigate('/login');
  }

  if (user && user.role == 'instructor') {
      navigate('*'); 
    }

}, [navigate,user]);

  const options = [
    { title: 'Enrolled Courses', path: '/dashboard/student/enrolled-courses' },
    { title: 'Lesson Page', path: '/dashboard/student/lesson' },
    { title: 'My Courses', path: '/dashboard/student/my-courses' },
    { title: 'Progress', path: '/dashboard/student/progress' },
    { title: 'Quiz', path: '/dashboard/student/quiz' },
    { title: 'Live Classes', path: '/dashboard/student/live' },
  ];

  return (
    <div className="student-dashboard">
      <h2 className="dashboard-heading">Welcome to Your Dashboard</h2>
      <div className="dashboard-cards-container">
        {options.map((opt, index) => (
          <div
            key={index}
            className="dashboard-card"
            onClick={() => navigate(opt.path)}
          >
            <h3>{opt.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
