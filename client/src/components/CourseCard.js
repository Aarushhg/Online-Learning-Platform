import React from 'react';
import './CourseCard.css';
import { useNavigate } from 'react-router-dom';

function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/course/${course.id}`, { state: { course } });
  };

const handleAddToCart = async () => {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch('http://localhost:5000/api/users/add-to-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId: course._id }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Failed to add to cart');
    } else {
      alert('Course added to cart!');
    }
  } catch (err) {
    console.error('Error adding to cart:', err);
    alert('Something went wrong.');
  }
};


  return (
    <div className="course-card">
      <img src={course.image} alt={course.title} />
      <h3>{course.title}</h3>
      <div className="course-buttons">
        <button onClick={handleViewDetails}>View Details</button>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

export default CourseCard;
