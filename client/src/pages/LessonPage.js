import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LessonPage.css';

const LessonPage = () => {
  const navigate = useNavigate();
  const [courseMap, setCourseMap] = useState({});
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to view lessons');
      return navigate('/login');
    }

    fetch('http://localhost:5000/api/courses/student-content', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const coursesByTitle = {};

        (data.lessons || []).forEach((lesson, index) => {
          const courseTitle = lesson.title || 'Untitled Course';
          if (!coursesByTitle[courseTitle]) {
            coursesByTitle[courseTitle] = {
              lessons: [],
              description: lesson.description || 'No description available'
            };
          }
          coursesByTitle[courseTitle].lessons.push({
            _id: `${index}`,
            title: `Lesson ${index + 1}`,
            videoUrl: lesson.videoUrl
          });
        });

        setCourseMap(coursesByTitle);
        const firstCourse = Object.keys(coursesByTitle)[0];
        if (firstCourse) {
          setSelectedCourseId(firstCourse);
          const firstLesson = coursesByTitle[firstCourse].lessons[0];
          setSelectedLesson(firstLesson);
        }
      })
      .catch(err => console.error('Failed to fetch lessons:', err));
  }, [navigate]);

  const getEmbedUrl = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="lesson-page" style={{ display: 'flex' }}>
      <div style={{ flex: 3 }}>
        <h2>{selectedLesson ? `Lesson: ${selectedLesson.title}` : 'No Lessons Found'}</h2>

        {selectedLesson && (
          <>
            <div className="video-container">
              {selectedLesson.videoUrl ? (
                <iframe
                  title="lesson-video"
                  width="100%"
                  height="400"
                  src={getEmbedUrl(selectedLesson.videoUrl)}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              ) : (
                <p>No video available for this lesson.</p>
              )}
            </div>

            <div className="lesson-content">
              <h3>Course Description:</h3>
              <p>{courseMap[selectedCourseId]?.description || 'No description available'}</p>
            </div>

            <div className="comment-section">
              <h3>Q&A / Discussion</h3>
              <textarea placeholder="Ask a question or comment here..." rows={4} />
              <button className="submit-comment">Post</button>
            </div>
          </>
        )}
      </div>

      <div style={{ flex: 1, paddingLeft: '20px' }}>
        <h4>Courses</h4>
        {Object.entries(courseMap).map(([courseTitle, data]) => (
          <div key={courseTitle}>
            <button
              onClick={() => {
                setSelectedCourseId(courseTitle);
                setSelectedLesson(data.lessons[0]);
              }}
              style={{
                fontWeight: selectedCourseId === courseTitle ? 'bold' : 'normal',
                display: 'block',
                marginBottom: '5px'
              }}
            >
              {courseTitle}
            </button>
            {selectedCourseId === courseTitle && (
              <div style={{ marginLeft: '10px' }}>
                {data.lessons.map(lesson => (
                  <button
                    key={lesson._id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={selectedLesson?._id === lesson._id ? 'active-lesson' : ''}
                    style={{ display: 'block', margin: '2px 0' }}
                  >
                    {lesson.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonPage;
