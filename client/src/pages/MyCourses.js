// src/pages/MyCourses.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyCourses.css';

const MyCourses = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to access this page');
      navigate('/login');
      return;
    }

    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/my-courses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await res.json();
        setEnrolledCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        alert('Failed to fetch your courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="my-courses-container">
      <h2>My Courses</h2>

      {enrolledCourses.length === 0 ? (
        <div className="no-courses">
          <p>You haven't enrolled in any courses yet.</p>
          <button onClick={() => navigate('/courses')}>Start Learning</button>
        </div>
      ) : (
        <div className="courses-list">
          {enrolledCourses.map(course => (
            <div className="course-card" key={course._id || course.id}>
              <h3>{course.title}</h3>
              <p><strong>Instructor:</strong> {course.instructor}</p>
              <p><strong>Progress:</strong> {course.progress || '0%'}</p>
              <button>Continue Learning</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
