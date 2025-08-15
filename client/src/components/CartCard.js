// src/components/CartCard.js
import React from 'react';
import './CartCard.css';

const CartCard = ({ course, onDelete }) => {
  return (
    <div className="cart-card">
      <img src={course.image} alt={course.title} />
      <div className="cart-card-content">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <p><strong>Instructor:</strong> {course.instructor}</p>
        <p><strong>Price:</strong> ₹{course.price}</p>
        <button onClick={() => onDelete(course._id)}>Remove</button>
      </div>
    </div>
  );
};

export default CartCard;
