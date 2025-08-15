import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to access this page');
      return navigate('/login');
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/courses/student-content', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          return navigate('/login');
        }

        const data = await res.json();
        const rawNotifications = data.notifications || [];

        const formatted = rawNotifications.map((note, index) => {
          if (typeof note === 'string') {
            return {
              id: index.toString(),
              title: `Notification ${index + 1}`,
              message: note,
              read: false,
              timestamp: Date.now() - index * 3600000,
            };
          } else if (typeof note === 'object') {
            return {
              id: index.toString(),
              title: note.title || `Notification ${index + 1}`,
              message: note.message || '',
              read: false,
              timestamp: note.createdAt ? new Date(note.createdAt).getTime() : Date.now(),
            };
          } else {
            return null;
          }
        }).filter(Boolean); // remove nulls

        setNotifications(formatted);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [navigate]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <div className="notifications-page">
      <h2>Your Notifications</h2>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="no-notifications">
          you'll receive updates regarding courses, lessons and live classes here
        </p>
      ) : (
        notifications.map(note => (
          <div
            className={`notification-card ${note.read ? 'read' : 'unread'}`}
            key={note.id}
            onClick={() => markAsRead(note.id)}
          >
            <h3>{note.title}</h3>
            <p>{note.message}</p>
            <small>{new Date(note.timestamp).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsPage;
