import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If courses are passed from navigation, use them; else fetch from cart
  const [courses, setCourses] = useState(location.state?.courses || []);
  const [loading, setLoading] = useState(!location.state?.courses);

  useEffect(() => {
    const fetchCartCourses = async () => {
      if (courses.length === 0) {
        const token = localStorage.getItem('token');
        try {
          const res = await fetch('http://localhost:5000/api/users/cart', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error('Failed to fetch cart');
          const data = await res.json();
          setCourses(data);
        } catch (error) {
          console.error('Cart fetch error:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCartCourses();
  }, [courses]);

  const amount = courses.reduce((sum, course) => sum + course.price, 0);

  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    });

    const data = await res.json();

    const options = {
      key: 'rzp_test_GTJMRW7eJdFppG',
      amount: amount * 100,
      currency: 'INR',
      name: 'Online Learning Platform',
      description: 'Course Purchase',
      order_id: data.orderId,
      handler: async function (response) {
        // ✅ Send success to backend for enrolling user
        await fetch('http://localhost:5000/api/users/complete-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ courseIds: courses.map(c => c._id) })
        });
        alert('Payment Successful!');
        navigate('/dashboard/enrolled-courses');
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      theme: {
        color: '#191970'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="payment-page">
      <h2>Payment</h2>
      {loading ? (
        <p>Loading cart...</p>
      ) : courses.length === 0 ? (
        <p>No courses to purchase.</p>
      ) : (
        <>
          <div className="course-summary">
            {courses.map(course => (
              <p key={course._id}>{course.title} - ₹{course.price}</p>
            ))}
          </div>
          <div className="total-amount">
            Total: ₹{amount}
          </div>
          <button className="pay-button" onClick={handlePayment}>Pay Now</button>
        </>
      )}
    </div>
  );
};

export default PaymentPage;
