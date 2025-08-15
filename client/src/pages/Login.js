import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // ✅ Correct import
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Use login from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      // ✅ Save to context + localStorage
      login(user); // updates context
      localStorage.setItem('token', token);

      // ✅ Navigate based on role
      if (user.role === 'student') {
        navigate('/dashboard/student');
      } else if (user.role === 'instructor') {
        navigate('/dashboard/instructor');
      } else {
        navigate('/dashboard/admin');
      }

    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to LearnPro</h2>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <label>Email</label>
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          required
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
        <p className="login-note">Don't have an account? <a href="/register">Register here</a></p>
      </form>
    </div>
  );
};

export default Login;
