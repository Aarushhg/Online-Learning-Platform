import React, { useState, useEffect } from 'react';
import './VerifyOTP.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30); // seconds
  const navigate = useNavigate();

  const pendingData = JSON.parse(localStorage.getItem('pendingRegistration'));
  const email = pendingData?.email;

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!pendingData) {
      alert('No registration data found. Please register again.');
      return navigate('/register');
    }

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setErrorMsg('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      // ✅ Step 1: Verify the OTP
      await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp: otp.trim()
      });

      // ✅ Step 2: Proceed to register
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        ...pendingData
      });

      localStorage.removeItem('pendingRegistration');
      localStorage.setItem('token', res.data.token);
      alert('Account created successfully!');
      navigate('/login');
    } catch (err) {
      const error = err.response?.data?.error || 'OTP verification failed';
      setErrorMsg(error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      alert('Email missing. Please register again.');
      return navigate('/register');
    }

    try {
      setResending(true);
      await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      alert('OTP resent to your email');
      setResendTimer(30); // reset timer
    } catch (err) {
      alert('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-form">
        <h2>Verify Your Email</h2>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <form onSubmit={handleSubmit}>
          <label>
            Enter OTP sent to your email:
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              placeholder="6-digit OTP"
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Register'}
          </button>
        </form>

        <button
          className="resend-otp-button"
          onClick={handleResendOTP}
          disabled={resending || resendTimer > 0}
        >
          {resending
            ? 'Resending...'
            : resendTimer > 0
            ? `Resend OTP in ${resendTimer}s`
            : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
