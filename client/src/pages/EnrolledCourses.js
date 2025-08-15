import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnrolledCourses.css';

const EnrolledCourses = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // ✅ Check auth on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to access this page');
      navigate('/login');
    } else {
      fetchEnrolledCourses(token);
    }
  }, [navigate]);

  // ✅ Fetch enrolled courses from backend
  const fetchEnrolledCourses = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/enrolled-courses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch enrolled courses');
      }

      const data = await res.json();
      setEnrolledCourses(data);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
    }
  };

  return (
    <div className="enrolled-courses-container">
      <h2>Your Enrolled Courses</h2>
      <div className="enrolled-courses-list">
        {enrolledCourses.length === 0 ? (
          <p>You haven't enrolled in any courses yet.</p>
        ) : (
          enrolledCourses.map((course) => (
            <div key={course._id} className="enrolled-course-card">
              <h3>{course.title}</h3>
              <p><strong>Instructor:</strong> {course.instructor}</p>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${course.progress || 0}%` }}
                ></div>
              </div>
              <p>{course.progress || 0}% completed</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;
