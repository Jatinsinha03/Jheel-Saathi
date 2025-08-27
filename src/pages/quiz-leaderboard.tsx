import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface LeaderboardEntry {
  username: string;
  score: number;
  completedAt: string;
}

export default function QuizLeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/quiz-leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedal = (position: number) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return `${position + 1}.`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    if (score >= 4) return '#3b82f6';
    return '#ef4444';
  };

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
          <p style={{ color: '#6b7280' }}>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

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
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            Quiz Leaderboard
          </h1>
          <button
            onClick={() => router.push('/quiz')}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Take Quiz
          </button>
        </div>

        {leaderboard.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem'
            }}>
              🎯
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: '#374151'
            }}>
              No Quiz Attempts Yet
            </h3>
            <p style={{
              fontSize: '1rem',
              marginBottom: '2rem'
            }}>
              Be the first to take the quiz and claim the top spot!
            </p>
            <button
              onClick={() => router.push('/quiz')}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px 32px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '500'
              }}
            >
              Start Quiz Now
            </button>
          </div>
        ) : (
          <>
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                color: '#1f2937',
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                Leaderboard Statistics
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#059669'
                  }}>
                    {leaderboard.length}
                  </div>
                  <div style={{
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Total Participants
                  </div>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  border: '1px solid #fde68a'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#d97706'
                  }}>
                    {Math.max(...leaderboard.map(entry => entry.score))}
                  </div>
                  <div style={{
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Highest Score
                  </div>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '8px',
                  border: '1px solid #bae6fd'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#0369a1'
                  }}>
                    {Math.round(leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length)}
                  </div>
                  <div style={{
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Average Score
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                backgroundColor: '#1f2937',
                color: 'white',
                padding: '16px 24px',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Top Performers
              </div>
              
              <div>
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '20px 24px',
                      borderBottom: index < leaderboard.length - 1 ? '1px solid #e5e7eb' : 'none',
                      backgroundColor: index < 3 ? '#f0fdf4' : 'white',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '60px',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      {getMedal(index)}
                    </div>
                    
                    <div style={{
                      flex: 1,
                      marginLeft: '16px'
                    }}>
                      <div style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {entry.username}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        Completed on {new Date(entry.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: getScoreColor(entry.score),
                      marginLeft: '16px'
                    }}>
                      {entry.score}/10
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              marginTop: '2rem',
              textAlign: 'center'
            }}>
              <button
                onClick={() => router.push('/quiz')}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '16px 32px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: '500',
                  marginRight: '16px'
                }}
              >
                Take Quiz Again
              </button>
              <button
                onClick={() => router.push('/')}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '16px 32px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: '500'
                }}
              >
                Go Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
