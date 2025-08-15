import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourseUpload.css';

const CourseUpload = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    lessons: '',
    liveClasses: '',
    notifications: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return alert('Please select a course');

    const payload = {};
    Object.entries(formData).forEach(([key, val]) => {
      if (['lessons', 'liveClasses', 'notifications'].includes(key)) {
        const list = val.split('\n').filter((item) => item.trim() !== '');
        if (list.length) payload[key] = list;
      } else if (val.trim() !== '') {
        payload[key] = val;
      }
    });

    try {
      await axios.put(`http://localhost:5000/api/courses/${selectedCourseId}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Course updated successfully');

      navigate('/');
      
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating course');
    }
  };

  return (
    <div className="course-upload-page">
      <h2>Update Course</h2>

      <form className="course-upload-form" onSubmit={handleSubmit}>
        <label>Select a Course:</label>
        <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
          <option value="">-- Select a course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>

        <label>Title</label>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} />

        <label>Description</label>
        <textarea name="description" placeholder="Description" onChange={handleChange} />

        <label>Price</label>
        <input type="text" name="price" placeholder="Price" onChange={handleChange} />

        <label>Category</label>
        <input type="text" name="category" placeholder="Category" onChange={handleChange} />

        <label>Image URL</label>
        <input type="text" name="image" placeholder="Image URL" onChange={handleChange} />

        <label>Lessons (one per line)</label>
        <textarea name="lessons" placeholder="Add lessons (one per line)" onChange={handleChange} />

        <label>Live Classes (one per line)</label>
        <textarea name="liveClasses" placeholder="Add live classes (one per line)" onChange={handleChange} />

        <label>Notifications (one per line)</label>
        <textarea name="notifications" placeholder="Add notifications (one per line)" onChange={handleChange} />

        <button type="submit">Update Course</button>
      </form>
    </div>
  );
};

export default CourseUpload;
