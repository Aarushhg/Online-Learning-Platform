  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import './CreateCourse.css';

  const CreateCourse = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: '',
      price: '',
      image: '', // now expecting a URL string
      lessons: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:5000/api/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (!res.ok) throw new Error('Failed to create course');
        alert('Course successfully created');

        navigate('/');

      } catch (err) {
        console.error('Course creation error:', err);
        alert('Error creating course');
      }
    };

    return (
      <div className="create-course-page">
        <h2>Create New Course</h2>
        <form onSubmit={handleSubmit} className="course-form">
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Course Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category (e.g., Data Science)"
            value={formData.category}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price (INR)"
            value={formData.price}
            onChange={handleChange}
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
          />

          <input
            type="text"
            name="lessons"
            placeholder="Lessons (comma-separated)"
            value={formData.lessons}
            onChange={handleChange}
          />

          <button type="submit">Create Course</button>
        </form>
      </div>
    );
  };

  export default CreateCourse;
