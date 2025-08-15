import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LiveClassesPage.css';

const LiveClassesPage = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [now, setNow] = useState(new Date());
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to access this page');
      navigate('/login');
      return;
    }

    // ✅ Updated to fetch from /api/courses/student-content
    const fetchLiveClasses = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/courses/student-content', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch live classes');

        const data = await res.json();

        const rawClasses = data.liveClasses || [];

        if (rawClasses.length === 0) {
          setError('No live classes to display');
        } else {
          const parsedSessions = rawClasses.map((link, index) => ({
            _id: index.toString(),
            title: `Live Class ${index + 1}`,
            instructor: 'Your Instructor', // Placeholder
            link,
            startTime: new Date(Date.now() + (index + 1) * 60000), // start in +1, +2, +3 min
          }));

          setSessions(parsedSessions);
        }
      } catch (err) {
        console.error('Live class fetch error:', err);
        setError('No live classes to display');
      }
    };

    fetchLiveClasses();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = (startTime) => {
    const diff = startTime - now;
    if (diff <= 0) return 'Live now!';
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="live-classes-page">
      <h2>Upcoming Live Classes</h2>

      {error ? (
        <p>{error}</p>
      ) : (
        sessions.map((session) => (
          <div className="live-session" key={session._id}>
            <h3>{session.title}</h3>
            <p><strong>Instructor:</strong> {session.instructor}</p>
            <p><strong>Starts in:</strong> {getTimeRemaining(session.startTime)}</p>
            <a href={session.link} target="_blank" rel="noopener noreferrer">
              <button>Join Class</button>
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default LiveClassesPage;
