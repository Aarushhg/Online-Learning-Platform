// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-hero">
        <div className="home-content">
          <h1>Welcome to LearnPro</h1>
          <p>Explore top courses, track your progress, and learn from the best instructors worldwide.</p>
          <Link to="/courses" className="home-btn">Browse Courses</Link>
        </div>
      </header>

      <section className="home-features">
        <h2>Why Choose LearnPro?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Interactive Learning</h3>
            <p>Engage in real-time quizzes, discussions, and virtual classes.</p>
          </div>
          <div className="feature-card">
            <h3>Track Progress</h3>
            <p>Keep an eye on your learning milestones and achievements.</p>
          </div>
          <div className="feature-card">
            <h3>Expert Instructors</h3>
            <p>Learn from industry professionals and educators worldwide.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

