import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);

  // New states for fetched enrolled courses and loading state
  const [userEnrolledCourses, setUserEnrolledCourses] = useState([]);
  const [loadingEnrolledCourses, setLoadingEnrolledCourses] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUsersAndCourses = async () => {
      try {
        const [userRes, courseRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/admin/courses', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if ([userRes.status, courseRes.status].some(code => code === 401 || code === 403)) {
          navigate('*');
          return;
        }

        const userData = await userRes.json();
        const courseData = await courseRes.json();

        setUsers(Array.isArray(userData) ? userData : userData.users || []);
        setCourses(Array.isArray(courseData) ? courseData : []);
      } catch (err) {
        console.error('Error loading admin data:', err);
      }
    };

    fetchUsersAndCourses();
  }, [navigate]);

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/user/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/course/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');
      setCourses(prev => prev.filter(c => c._id !== courseId));
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  const handleRemoveEnrollment = async (userId, courseId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/user/${userId}/remove-enrollment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) throw new Error('Failed to remove enrollment');

      const updatedUser = await res.json();

      setUsers(prevUsers =>
        prevUsers.map(u => (u._id === updatedUser._id ? updatedUser : u))
      );

      // Also update userEnrolledCourses in UI after removal
      setUserEnrolledCourses(prev => prev.filter(c => c._id !== courseId));
    } catch (err) {
      console.error('Failed to remove enrollment:', err);
    }
  };

  const handleDeleteCourseItem = async (courseId, type, index) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}/remove-item`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, index }),
      });

      if (!res.ok) throw new Error('Failed to delete item');
      const data = await res.json();

      setCourses(prev =>
        prev.map(c => (c._id === courseId ? data.course : c))
      );
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const toggleExpand = (courseId) => {
    setExpandedCourseId(prev => (prev === courseId ? null : courseId));
  };

  // Updated toggleUserExpand to fetch enrolled courses on user expand
  const toggleUserExpand = async (userId) => {
    if (expandedUserId === userId) {
      // Collapse: reset states
      setExpandedUserId(null);
      setUserEnrolledCourses([]);
    } else {
      setExpandedUserId(userId);
      setLoadingEnrolledCourses(true);
      setUserEnrolledCourses([]); // Clear old courses while loading

      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:5000/api/admin/user/${userId}/enrolled-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch enrolled courses');
        const data = await res.json();
        setUserEnrolledCourses(data.enrolledCourses || []);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setUserEnrolledCourses([]);
      } finally {
        setLoadingEnrolledCourses(false);
      }
    }
  };

  // No change to getCoursesCreatedByUser
  const getCoursesCreatedByUser = (userId) => {
    return courses.filter(course => course.instructor?._id === userId);
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="stats-section">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p>{courses.length}</p>
        </div>
        <button className="create-course-btn" onClick={() => navigate('/create-course')}>
          Create Course
        </button>
      </div>

      <div className="admin-tables">
        <div className="table-section">
          <h3>Users</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <React.Fragment key={user._id}>
                  <tr onClick={() => toggleUserExpand(user._id)} style={{ cursor: 'pointer' }}>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {expandedUserId === user._id && (
                    <tr>
                      <td colSpan="5">
                        <div className="sub-table">
                          {(user.role === 'student' || user.role === 'admin') && (
                            <>
                              <h4>Enrolled Courses</h4>
                              {loadingEnrolledCourses ? (
                                <p>Loading enrolled courses...</p>
                              ) : (
                                <ul>
                                  {userEnrolledCourses.length > 0 ? (
                                    userEnrolledCourses.map(course => (
                                      <li key={course._id}>
                                        {course.title}
                                        <button
                                          className="delete-btn"
                                          style={{ marginLeft: '10px' }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveEnrollment(user._id, course._id);
                                          }}
                                        >
                                          Remove
                                        </button>
                                      </li>
                                    ))
                                  ) : (
                                    <li>No enrolled courses</li>
                                  )}
                                </ul>
                              )}
                            </>
                          )}

                          {(user.role === 'instructor' || user.role === 'admin') && (
                            <>
                              <h4>Created Courses</h4>
                              <ul>
                                {getCoursesCreatedByUser(user._id).map(course => (
                                  <li key={course._id}>
                                    {course.title}
                                    <button
                                      className="delete-btn"
                                      style={{ marginLeft: '10px' }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCourse(course._id);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </li>
                                ))}
                                {getCoursesCreatedByUser(user._id).length === 0 && (
                                  <li>No created courses</li>
                                )}
                              </ul>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-section">
          <h3>Courses</h3>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Lessons</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <React.Fragment key={course._id}>
                  <tr>
                    <td onClick={() => toggleExpand(course._id)} style={{ cursor: 'pointer' }}>
                      {course.title}
                    </td>
                    <td>{course.instructor?.name || 'N/A'}</td>
                    <td>{course.lessons?.length || 0}</td>
                    <td>
                      <button onClick={() => navigate(`/upload-course?id=${course._id}`)}>Update</button>
                      <button className="delete-btn" onClick={() => handleDeleteCourse(course._id)}>Delete</button>
                    </td>
                  </tr>
                  {expandedCourseId === course._id && (
                    <tr>
                      <td colSpan="4">
                        <div className="sub-table">
                          <h4>Lessons</h4>
                          <ul>
                            {course.lessons?.map((lesson, i) => (
                              <li key={i}>
                                {lesson}
                                <button onClick={() => handleDeleteCourseItem(course._id, 'lessons', i)}>Delete</button>
                              </li>
                            ))}
                          </ul>

                          <h4>Notifications</h4>
                          <ul>
                            {course.notifications?.map((note, i) => (
                              <li key={i}>
                                {note}
                                <button onClick={() => handleDeleteCourseItem(course._id, 'notifications', i)}>Delete</button>
                              </li>
                            ))}
                          </ul>

                          <h4>Live Classes</h4>
                          <ul>
                            {course.liveClasses?.map((link, i) => (
                              <li key={i}>
                                {link}
                                <button onClick={() => handleDeleteCourseItem(course._id, 'liveClasses', i)}>Delete</button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
