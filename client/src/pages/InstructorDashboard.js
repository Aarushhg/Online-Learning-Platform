import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Import context to get user role
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // ✅ Get user from context
  const navigate = useNavigate(); // ✅ For redirect

  // ✅ Redirect if student
  useEffect(() => {
    if (user && user.role == 'student') {
      navigate('*'); // Redirect to NotFound.js
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:5000/api/courses/instructor', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch instructor courses');
        }

        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch instructor courses', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCourses();
  }, []);

  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this course?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete course');
      }

      setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
      alert('Course deleted successfully');
    } catch (error) {
      console.error('Failed to delete course', error);
      alert('Error deleting course');
    }
  };

  return (
    <div className="instructor-dashboard">
      <h2 className="dashboard-heading">Instructor Dashboard</h2>

      <div className="dashboard-cards">
        <Link to="/create-course" className="dashboard-card">Create Course</Link>
        <Link to="/upload-course" className="dashboard-card">Update Course</Link>
      </div>

      <div className="your-courses-section">
        <h3>Your Courses</h3>
        {loading ? (
          <p>Loading...</p>
        ) : courses.length === 0 ? (
          <p className="no-courses-message">You haven't uploaded any courses yet.</p>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="course-row">
              <div className="course-info">
                <h4>{course.title}</h4>
                <p>Status: {course.status}</p>
              </div>
              <div className="course-actions">
                <button className="delete-btn" onClick={() => handleDelete(course._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
