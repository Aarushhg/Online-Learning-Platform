import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizPage.css';

const QuizPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view quizzes');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/quizzes/my-quizzes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch quizzes');

        const data = await res.json();
        if (data.length === 0) {
          setError('No quizzes to display');
        } else {
          setQuizzes(data);
          setAnswers(Array(data.length).fill(null));
        }
      } catch (err) {
        console.error('Quiz fetch error:', err);
        setError('No quizzes to display');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleOptionChange = (quizIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[quizIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let newScore = 0;
    quizzes.forEach((quiz, index) => {
      const correctIndex = quiz.questions[0]?.options.findIndex(
        opt => opt === quiz.questions[0]?.correctAnswer
      );
      if (answers[index] === correctIndex) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setSubmitted(true);
  };

  return (
    <div className="quiz-page">
      <h2>Quiz</h2>

      {loading ? (
        <p>Loading quizzes...</p>
      ) : error ? (
        <div className="quiz-empty">
          <p>{error}</p>
           
        </div>
      ) : (
        <>
          {quizzes.map((quiz, i) => (
            <div key={quiz._id} className="question-block">
              <h4>{i + 1}. {quiz.questions[0]?.question}</h4>
              {quiz.questions[0]?.options.map((option, j) => (
                <label key={j} className="option-label">
                  <input
                    type="radio"
                    name={`question-${i}`}
                    value={j}
                    checked={answers[i] === j}
                    onChange={() => handleOptionChange(i, j)}
                    disabled={submitted}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}

          {!submitted ? (
            <button className="submit-btn" onClick={handleSubmit}>Submit Quiz</button>
          ) : (
            <div className="score-section">
              <h3>Your Score: {score}/{quizzes.length}</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizPage;
