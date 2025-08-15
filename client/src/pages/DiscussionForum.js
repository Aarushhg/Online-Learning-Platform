import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DiscussionForum.css';

const DiscussionForum = () => {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // ✅ Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const currentUsername = storedUser?.name?.split(' ')[0] || 'Anonymous';

  // ✅ Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to access this page');
      navigate('/login');
    }
  }, [navigate]);

  // ✅ Fetch all discussions
  useEffect(() => {
    fetch('http://localhost:5000/api/discussions')
      .then(res => res.json())
      .then(data => setThreads(data))
      .catch(err => console.error('Error fetching threads:', err));
  }, []);

  // ✅ Post a new thread
  const handlePost = async () => {
    if (!newThread.trim()) return;
    try {
      const res = await fetch('http://localhost:5000/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newThread, content: '', author: currentUsername }),
      });

      const newPost = await res.json();
      setThreads([newPost, ...threads]);
      setNewThread('');
    } catch (err) {
      console.error('Error posting thread:', err);
    }
  };

  // ✅ Post a reply to a thread
  const handleReplyPost = async (threadId) => {
  if (!replyText.trim()) return;

  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.name || "Anonymous";

  try {
    const res = await fetch(`http://localhost:5000/api/discussions/${threadId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, text: replyText }),
    });

    const updatedThread = await res.json();

    setThreads(prev =>
      prev.map(thread =>
        thread._id === threadId ? updatedThread : thread
      )
    );

    setReplyText('');
    setReplyingTo(null);
  } catch (err) {
    console.error('Error posting reply:', err);
  }
};

  return (
    <div className="discussion-forum">
      <h2>Course Discussion Forum</h2>

      <div className="new-thread">
        <textarea
          placeholder="Start a new discussion..."
          value={newThread}
          onChange={(e) => setNewThread(e.target.value)}
        />
        <button onClick={handlePost}>Post</button>
      </div>

      <div className="threads">
        {threads.map(thread => (
          <div key={thread._id} className="thread-card">
            <h3>{thread.title}</h3>
            <p><strong>Posted by:</strong> {thread.author || 'Anonymous'}</p>

            <div className="comments">
              {(thread.comments || []).map((comment, idx) => (
                <p key={comment._id || idx}>
                  <strong>{comment.author || 'Anonymous'}: </strong>{comment.text}
                </p>
              ))}
            </div>

            {replyingTo === thread._id ? (
              <div className="reply-box">
                <textarea
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button onClick={() => handleReplyPost(thread._id)}>Reply</button>
              </div>
            ) : (
              <button className="reply-toggle" onClick={() => setReplyingTo(thread._id)}>
                Reply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionForum;
