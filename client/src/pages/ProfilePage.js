import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const serverURL = 'http://localhost:5000';

  const [profile, setProfile] = useState(null); // initially null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to access this page');
        return navigate('/login');
      } 

      try {
        const res = await fetch('http://localhost:5000/api/profile', {
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
        setProfile({
          photo: data.profilePic || '',
          name: data.name || '',
          username: data.username || '',
          email: data.email || '',
          bio: data.bio || '',
          phone: data.phone || '',
        });
      } catch (error) {
        console.error('Profile fetch error:', error);
        alert('Something went wrong. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview image locally immediately
      const photoURL = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, photo: photoURL }));

      // Upload image to backend
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to upload a profile picture.');
        return;
      }

      const formData = new FormData();
      formData.append('profilePic', file);

      try {
        const res = await fetch('http://localhost:5000/api/profile/upload-profile-pic', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error || 'Failed to upload profile picture.');
          return;
        }

        const data = await res.json();
        // Update profile photo with server URL (so it persists on refresh)
        setProfile(prev => ({ ...prev, photo: data.profilePic }));

        // Optionally update user info in localStorage if you use it elsewhere
        localStorage.setItem('user', JSON.stringify(data.user));

      } catch (error) {
        console.error('Profile picture upload error:', error);
        alert('Error uploading profile picture. Please try again.');
      }
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to update your profile.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Profile updated successfully');
        localStorage.setItem('user', JSON.stringify(data.updatedUser));

        // Optional: refresh page to show updates in header
        // window.location.reload();
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Something went wrong while updating profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  if (loading || !profile) return <div style={{ padding: '2rem' }}>Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="sidebar">
        <h2>My Account</h2>
        <ul>
          <li>Profile</li>
          <li>My Courses</li>
          <li>Payments</li>
          <li>Settings</li>
          <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</li>
        </ul>
      </div>

      <div className="main-content">
        <h1>Welcome, {profile.name?.split?.(' ')[0] || 'User'}</h1>

        <div className="profile-form">
          <div className="photo-section">
            <img
              src={
                profile.photo
                  ? `${serverURL}${profile.photo}`
                  : 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png'
              }
              alt="Profile"
              className="profile-photo"
              onError={(e) => {
                e.target.src = 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png';
              }}
            />
            <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          </div>

          <div className="info-section">
            <label>
              Full Name:
              <input type="text" name="name" value={profile.name || ''} onChange={handleChange} />
            </label>
            <label>
              Username:
              <input type="text" name="username" value={profile.username || ''} onChange={handleChange} />
            </label>
            <label>
              Bio:
              <textarea name="bio" value={profile.bio || ''} onChange={handleChange} />
            </label>
            <label>
              Phone Number:
              <input type="tel" name="phone" value={profile.phone || ''} onChange={handleChange} />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={profile.email || ''} onChange={handleChange} />
            </label>

            <div className="profile-actions">
              <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
              <button className="password-btn">Change Password</button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
