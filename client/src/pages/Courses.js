import React, { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import './Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = async () => {
    try {
      const query = new URLSearchParams({
        search,
        category,
        page,
        limit: 6
      });

      const res = await fetch(`http://localhost:5000/api/courses?${query.toString()}`);
      const data = await res.json();

      setCourses(data.courses || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, category, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <div className="courses-page">
      <h2>All Courses</h2>

      {/* 🔍 Search & Filter */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={handleSearchChange}
        />

        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          <option value="Web Dev">Programming</option>
          <option value="DSA">Design</option>
          <option value="UI/UX">Math</option>
          <option value="Backend">Science</option>
          <option value="Frontend">Business</option>
          {/* Add more categories as needed */}
        </select>
      </div>

      {/* 🧱 Course Cards */}
      <div className="courses-grid">
        {courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        )}
      </div>

      {/* 📄 Pagination */}
      <div className="pagination-controls">
        <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Courses;
