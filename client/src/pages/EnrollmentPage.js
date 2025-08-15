// pages/EnrollmentPage.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './EnrollmentPage.css';

const EnrollmentPage = () => {
  const location = useLocation();
  const course = location.state?.course;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    paymentMethod: 'credit-card',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Enrollment confirmed for ${formData.name} in "${course?.title}"`);
  };

  return (
    <div className="enrollment-container">
      <h2 className="enrollment-title">Enroll in {course?.title || "Course"}</h2>
      <p className="enrollment-instructor"><strong>Instructor:</strong> {course?.instructor || "Instructor Name"}</p>
      <p className="enrollment-description">{course?.description || "This is a course description."}</p>

      <form className="enroll-form" onSubmit={handleSubmit}>
        <h3>User Details</h3>
        <label>
          Full Name:
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email Address:
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <h3>Payment Method</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="credit-card"
              checked={formData.paymentMethod === 'credit-card'}
              onChange={handleChange}
            />
            Credit Card
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={formData.paymentMethod === 'upi'}
              onChange={handleChange}
            />
            UPI
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="net-banking"
              checked={formData.paymentMethod === 'net-banking'}
              onChange={handleChange}
            />
            Net Banking
          </label>
        </div>

        <button type="submit">Confirm & Pay</button>
      </form>
    </div>
  );
};

export default EnrollmentPage;
