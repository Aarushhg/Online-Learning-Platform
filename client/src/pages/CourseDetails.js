import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CourseDetails.css';

const CourseDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course;

  if (!course) {
    return <div className="course-details-container">No course data found.</div>;
  }

  const handleEnrollNow = () => {
    // ✅ Redirect to Payment Page with selected course
    navigate('/payment', { state: { courses: [course] } });
  };

  return (
    <div className="course-details-container">
      <h2>{course.title}</h2>
      <p><strong>Instructor:</strong> {course.instructor || 'Jane Doe'}</p>
      <p><strong>Description:</strong> {course.description}</p>
      {/* Display course price */}
      <p><strong>Price:</strong> ₹{course.price}</p>

      <button className="enroll-btn" onClick={handleEnrollNow}>
        Enroll Now
      </button>
    </div>
  );
};

export default CourseDetails;
