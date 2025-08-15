import React, { useEffect, useState } from 'react';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';
import CartCard from '../components/CartCard'; // ✅ Import CartCard

const CartPage = () => {
  const [cartCourses, setCartCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to view your cart');
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/users/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch cart');

        const data = await res.json();
        setCartCourses(data);
      } catch (error) {
        console.error('Cart fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleDelete = async (courseId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/users/remove-from-cart/${courseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setCartCourses(prev => prev.filter(course => course._id !== courseId));
      } else {
        console.error('Delete failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleProceedToPayment = () => {
    navigate('/payment', { state: {cartCourses} });
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : cartCourses.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-list">
            {cartCourses.map((course) => (
              <CartCard
                key={course._id}
                course={course}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <div className="cart-footer">
            <button className="proceed-btn" onClick={handleProceedToPayment}>
              Proceed to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
