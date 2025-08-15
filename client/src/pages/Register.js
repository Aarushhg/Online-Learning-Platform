// src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    password: '',
    confirmPassword: '',
    profilePic: '',
    role: 'student' // ✅ Default role
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isStrongPassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}])[A-Za-z\d@$!%*?&#^()[\]{}]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') {
      if (!isStrongPassword(value)) {
        setPasswordError(
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
        );
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setLoading(false);
      alert('Passwords do not match');
      return setErrorMsg('Passwords do not match');
    }

    if (!isStrongPassword(form.password)) {
      setLoading(false);
      alert(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      return setErrorMsg(
        'Weak password: Include uppercase, lowercase, number, and special character.'
      );
    }

    try {
      // Step 1: Send OTP
      await axios.post('http://localhost:5000/api/auth/send-otp', {
        email: form.email.trim(),
      });

      // Step 2: Save form data with role
      localStorage.setItem('pendingRegistration', JSON.stringify(form));

      // Step 3: Go to OTP verification page
      navigate('/verify-otp');
    } catch (err) {
      const error = err.response?.data?.error || 'Failed to send OTP';
      if (
        error === 'Email already registered' ||
        error === 'Username already taken' ||
        error === 'Name, username, email, and password are required'
      ) {
        alert(error);
      }
      setErrorMsg(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      <form className="register-form" onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Username:
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </label>

        <label>
          Email:
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Phone:
          <input type="text" name="phone" value={form.phone} onChange={handleChange} />
        </label>

        <label>
          Bio:
          <input type="text" name="bio" value={form.bio} onChange={handleChange} />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {passwordError && <span className="error-msg">{passwordError}</span>}
        </label>

        <label>
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Profile Picture URL (optional):
          <input type="text" name="profilePic" value={form.profilePic} onChange={handleChange} />
        </label>

        <label className="role-label">
          Register As:
          <select name="role" value={form.role} onChange={handleChange} className="role-select" required>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </label>

        <button type="submit" disabled={loading || passwordError}>
          {loading ? <div className="spinner"></div> : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
