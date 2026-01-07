import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [quizOver, setQuizOver] = useState(false);
  const [topic, setTopic] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const askedQuestionsRef = useRef([]);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [timerActive, setTimerActive] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const handleTimeUp = () => {
    setTimerActive(false);
    setFeedback("Time's up!");
    if (selectedOption === null) {
      setSelectedOption(-1); // Mark as no answer selected
    }
    setTimeout(() => {
      handleNext();
    }, 1500);
  };

  const goToHome = () => {
    setTopic("");
    setCurrentQuestion(null);
    setSelectedOption(null);
    setScore(0);
    setQuestionNumber(1);
    setQuizOver(false);
    setError(null);
    askedQuestionsRef.current = [];
    setFeedback(null);
    setTimeLeft(30);
    setTimerActive(false);
    setShowExplanation(false);
    setQuestionHistory([]);
  };

  const startQuiz = async () => {
    try {
      setIsTransitioning(true);
      setError(null);
      setScore(0);
      setQuestionNumber(1);
      setQuizOver(false);
      setSelectedOption(null);
      askedQuestionsRef.current = [];
      setFeedback(null);
      setTimeLeft(30);
      setTimerActive(false);
      setShowExplanation(false);
      setQuestionHistory([]);
      await fetchQuestion();
    } catch (error) {
      setError('Failed to start quiz. Please try again.');
      console.error('Quiz start error:', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setTimeLeft(30);
      setTimerActive(false);
      setSelectedOption(null);
      setFeedback(null);

      if (questionNumber > 5) {
        setQuizOver(true);
        return;
      }

      console.log('Sending request with askedQuestions:', askedQuestionsRef.current);

      const response = await axios.post('/api/chat', {
        message: '',
        askedQuestions: askedQuestionsRef.current
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data.question || !Array.isArray(response.data.options)) {
        throw new Error('Invalid response format from server');
      }

      // Add the new question to askedQuestions
      if (!askedQuestionsRef.current.includes(response.data.question)) {
        askedQuestionsRef.current.push(response.data.question);
      }
      
      // Update current question
      setCurrentQuestion({
        ...response.data,
        correctAnswer: response.data.options[response.data.answerIndex]
      });

    } catch (error) {
      console.error('Question fetch error:', error);
      if (error.response?.status === 400 && error.response?.data?.error === 'Maximum number of questions reached') {
        setQuizOver(true);
      } else {
        setError(error.response?.data?.details || error.message || 'Failed to fetch question');
      }
      setTimerActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = async (option) => {
    if (selectedOption) return; // Prevent multiple selections
    
    setSelectedOption(option);
    setTimerActive(true); // Start timer when answer is selected
    
    const isCorrect = option === currentQuestion.correctAnswer;
    setScore(prev => isCorrect ? prev + 1 : prev);
    
    // Add to question history with user's answer
    setQuestionHistory(prev => [...prev, {
      ...currentQuestion,
      userAnswer: option,
      isCorrect: isCorrect,
      correctAnswer: currentQuestion.correctAnswer
    }]);
    
    // Show feedback immediately
    setFeedback({
      isCorrect,
      explanation: currentQuestion.explanation
    });

    // Don't automatically move to next question
    // Let user control when to proceed
  };

  const handleNext = () => {
    if (questionNumber >= 5) {
      setQuizOver(true);
      return;
    }

    setQuestionNumber(prev => prev + 1);
    setSelectedOption(null);
    setFeedback(null);
    setTimerActive(false);
    setTimeLeft(30);
    fetchQuestion();
  };

  const restartQuiz = () => {
    setScore(0);
    setQuestionNumber(1);
    setQuizOver(false);
    setSelectedOption(null);
    setError(null);
    askedQuestionsRef.current = [];
    setTimeLeft(30);
    setTimerActive(false);
    setShowExplanation(false);
    setQuestionHistory([]);
    startQuiz();
  };

  const getProgressColor = () => {
    const percentage = (timeLeft / 30) * 100;
    if (percentage > 60) return '#48bb78'; // green
    if (percentage > 30) return '#ecc94b'; // yellow
    return '#f56565'; // red
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Link to="/" style={{ 
            textDecoration: 'none', 
            color: '#4a5568',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>←</span> Back to Home
          </Link>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#2d3748' }}>QuizBot</h1>
          {quizOver && (
            <button
              onClick={restartQuiz}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4299e1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Restart Quiz
            </button>
          )}
        </div>

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fed7d7',
            color: '#c53030',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        )}

        {/* Remove topic selection, show Start Quiz button if quiz not started */}
        {!currentQuestion && !quizOver && !isLoading && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2d3748' }}>Frontend Knowledge Quiz</h2>
            <p style={{ marginBottom: '2rem', color: '#4a5568' }}>
              Test your knowledge across all major frontend technologies: JavaScript, React, HTML, CSS, and more!
            </p>
            <button
              onClick={() => startQuiz()}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#4299e1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
              onMouseOver={e => e.target.style.backgroundColor = '#3182ce'}
              onMouseOut={e => e.target.style.backgroundColor = '#4299e1'}
            >
              Start Quiz
            </button>
          </div>
        )}

        {!quizOver && currentQuestion && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '1.1rem', color: '#4a5568' }}>
                Question {questionNumber} of 5
              </div>
              <div style={{
                width: '100px',
                height: '8px',
                backgroundColor: '#e2e8f0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(timeLeft / 30) * 100}%`,
                  height: '100%',
                  backgroundColor: getProgressColor(),
                  transition: 'width 1s linear'
                }}></div>
              </div>
            </div>

            <h2 style={{ marginBottom: '1.5rem', color: '#2d3748' }}>{currentQuestion.question}</h2>

            {/* Options */}
            <div className="space-y-4 mt-6">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionSelect(option)}
                  disabled={selectedOption}
                  className={`w-full p-4 text-left rounded-lg transition-colors ${
                    selectedOption
                      ? option === currentQuestion.correctAnswer
                        ? 'bg-green-100 border-green-500'
                        : option === selectedOption
                        ? 'bg-red-100 border-red-500'
                        : 'bg-gray-50 border-gray-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  } border-2`}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {/* Feedback and Next Button */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className={`p-4 rounded-lg ${
                  feedback.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <p className="font-medium mb-2">
                    {feedback.isCorrect ? 'Correct!' : 'Incorrect!'}
                  </p>
                  <p>{feedback.explanation}</p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {questionNumber < 5 ? 'Next Question' : 'Finish Quiz'}
                </motion.button>
              </motion.div>
            )}
          </div>
        )}

        {quizOver && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#2d3748' }}>Quiz Complete!</h2>
            <p style={{ fontSize: '1.25rem', color: '#4a5568', marginBottom: '1.5rem' }}>
              Your score: {score} out of 5
            </p>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Question History</h3>
              {questionHistory.map((q, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: q.isCorrect ? '#f0fff4' : '#fff5f5',
                    borderRadius: '4px',
                    textAlign: 'left'
                  }}
                >
                  <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{q.question}</p>
                  <p style={{ color: q.isCorrect ? '#2f855a' : '#c53030' }}>
                    Your answer: {q.userAnswer}
                    {!q.isCorrect && ` (Correct answer: ${q.correctAnswer})`}
                  </p>
                  <p style={{ marginTop: '0.5rem', color: '#4a5568' }}>{q.explanation}</p>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={restartQuiz}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4299e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#3182ce'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#4299e1'}
              >
                Try Again
              </button>
              <Link
                to="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#e2e8f0',
                  color: '#4a5568',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#cbd5e0'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#e2e8f0'}
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default QuizApp;

