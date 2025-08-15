import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProgressPage.css';

const ProgressPage = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Please log in to view your progress');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/progress', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch progress');

        const data = await res.json();

        if (data.length === 0) {
          setErrorMessage('Enroll in courses to track your progress');
        } else {
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        setErrorMessage('Enroll in courses to track your progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const totalCourses = courses.length;
  const completedCourses = courses.filter(c => c.progress === 100).length;

  return (
    <div className="progress-page">
      <h2>Your Learning Progress</h2>

      {loading ? (
        <p>Loading progress...</p>
      ) : errorMessage ? (
        <div className="empty-state">
          <p>{errorMessage}</p>
          <button onClick={() => navigate('/courses')}>Browse Courses</button>
        </div>
      ) : (
        <>
          <div className="summary">
            <p><strong>Total Enrolled:</strong> {totalCourses}</p>
            <p><strong>Completed:</strong> {completedCourses}</p>
          </div>

          <div className="progress-list">
            {courses.map((course, index) => (
              <div className="course-progress-card" key={index}>
                <h3>{course.title}</h3>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p>{course.progress}% completed</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressPage;
