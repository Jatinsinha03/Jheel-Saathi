import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

interface QuizQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation?: string;
  category: string;
  difficulty: string;
}

interface QuizAttempt {
  userId: string;
  score: number;
  answers: Record<string, string>;
}

export default function QuizPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchQuestions();
    }
  }, [user]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/quiz-questions');
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
  };

  const handleSubmitQuiz = async () => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/quiz-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          score,
          answers: userAnswers
        }),
      });

      if (response.ok) {
        alert('Quiz submitted successfully!');
        router.push('/quiz-leaderboard');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    fetchQuestions();
  };

  // Redirect if not logged in
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#bbdde1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#1f2937', marginBottom: '16px' }}>
            🔒 Authentication Required
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Please log in to take the quiz.
          </p>
          <button
            onClick={() => router.push('/login')}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#bbdde1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#bbdde1',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            color: '#1f2937',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            🎉 Quiz Results
          </h1>

          <div style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <div style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              color: score >= 7 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444',
              marginBottom: '1rem'
            }}>
              {score}/10
            </div>
            <div style={{
              fontSize: '1.5rem',
              color: '#6b7280',
              marginBottom: '1rem'
            }}>
              {score >= 8 ? '🏆 Excellent! You\'re a water body expert!' :
               score >= 6 ? '👍 Good job! You know your lakes well!' :
               score >= 4 ? '📚 Not bad! Keep learning about water bodies!' :
               '📖 Keep studying! Water bodies are fascinating!'}
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#6b7280'
            }}>
              {Math.round((score / 10) * 100)}% accuracy
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '3rem'
          }}>
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                opacity: submitting ? 0.6 : 1
              }}
            >
              {submitting ? 'Submitting...' : '📊 Submit Score'}
            </button>
            <button
              onClick={handleRetakeQuiz}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              🔄 Retake Quiz
            </button>
            <button
              onClick={() => router.push('/quiz-leaderboard')}
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              🏆 View Leaderboard
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              🏠 Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#bbdde1',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            color: '#1f2937',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            🌊 Lake & Water Body Quiz
          </h1>
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          marginBottom: '2rem',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            height: '100%',
            backgroundColor: '#10b981',
            transition: 'width 0.3s ease'
          }}></div>
        </div>

        {currentQuestion && (
          <>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                color: '#1f2937',
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                {currentQuestion.question}
              </h2>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {[
                  { key: 'A', value: currentQuestion.optionA },
                  { key: 'B', value: currentQuestion.optionB },
                  { key: 'C', value: currentQuestion.optionC },
                  { key: 'D', value: currentQuestion.optionD }
                ].map(({ key, value }) => (
                  <button
                    key={key}
                    onClick={() => handleAnswerSelect(currentQuestion.id, key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      border: userAnswers[currentQuestion.id] === key ? '2px solid #10b981' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: userAnswers[currentQuestion.id] === key ? '#f0fdf4' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: userAnswers[currentQuestion.id] === key ? '#10b981' : '#e5e7eb',
                      color: userAnswers[currentQuestion.id] === key ? 'white' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginRight: '12px'
                    }}>
                      {key}
                    </div>
                    <span style={{
                      color: '#374151',
                      fontSize: '16px'
                    }}>
                      {value}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                style={{
                  backgroundColor: currentQuestionIndex === 0 ? '#e5e7eb' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  opacity: currentQuestionIndex === 0 ? 0.5 : 1
                }}
              >
                ← Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!userAnswers[currentQuestion.id]}
                style={{
                  backgroundColor: !userAnswers[currentQuestion.id] ? '#e5e7eb' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: !userAnswers[currentQuestion.id] ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  opacity: !userAnswers[currentQuestion.id] ? 0.5 : 1
                }}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
