import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CommentsPage.css';

const CommentsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to access this page');
      navigate('/login');
    }
  }, [navigate]);

  const [comments, setComments] = useState([
    { user: 'John Doe', text: 'Can someone explain topic 3 again?' },
    { user: 'Jane Smith', text: 'Great course so far!' },
  ]);
  const [newComment, setNewComment] = useState('');

  // ✅ Fetch comments from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/comments')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setComments(data);
        } else {
          console.error('Unexpected response (not array):', data);
          setComments([]);
        }
      })
      .catch(err => {
        console.error('Error fetching comments:', err);
        setComments([]);
      });
  }, []);

  // ✅ Add new comment to backend
  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const username = storedUser?.name || 'You';

    try {
      const res = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, text: newComment })
      });

      const postedComment = await res.json();
      if (postedComment && postedComment.text) {
        setComments(prev => [postedComment, ...prev]); // Show new comment at top
        setNewComment('');
      } else {
        console.error('Invalid comment response:', postedComment);
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment');
    }
  };

  return (
    <div className="comments-page">
      <h2>Comments / Q&A</h2>
      
      <div className="comment-input">
        <textarea
          placeholder="Ask a question or share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button onClick={handleAddComment}>Post Comment</button>
      </div>

      <div className="comment-list">
        {(comments || []).map((comment, index) => (
          <div key={index} className="comment-box">
            <strong>{comment.username || comment.user || 'Anonymous'}:</strong>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsPage;
