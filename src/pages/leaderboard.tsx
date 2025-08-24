import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Link from "next/link";
interface LeaderboardEntry {
  username: string;
  questionnaireCount: number;
  rank: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#fbbf24'; // Gold
    if (rank === 2) return '#9ca3af'; // Silver
    if (rank === 3) return '#b45309'; // Bronze
    return '#6b7280'; // Default
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#bbdde1',
      padding: ''
    }}>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-none">
        <Link href="/landing">
        
        <h1 className="text-2xl font-bold text-[#3d73a1]">Jheel Saathi</h1>
        </Link>
        <div className="space-x-4">
          <Link href="/login">
            <button className="px-4 py-2 rounded-lg border border-[#3d73a1] text-[#3d73a1] hover:bg-blue-50 transition">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-4 py-2 rounded-lg bg-[#3d73a1] text-white hover:bg-[#1d4ed8] transition">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#3d73a1',
            margin: '40px 0px 0px 0px',
            textShadow: '0 4px 8px rgba(0,0,0,0.0)'
          }}>
            Leaderboard
          </h1>
          <p style={{
            color: '#000',
            fontSize: '1.25rem',
            margin: '0px 0 0 0px'
          }}>
            Top environmental contributors
          </p>
        </div>

        {/* <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Back to Map
          </button>
          <button
            onClick={() => router.push('/landing')}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              padding: '12px 20px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Home
          </button>
        </div> */}
      </div>

      {/* Leaderboard Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {loading ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: '#6b7280', fontSize: '18px' }}>Loading leaderboard...</p>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#eef6f9',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            {leaderboard.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
                <h3 style={{ color: '#374151', fontSize: '1.5rem', marginBottom: '8px' }}>
                  No Data Yet
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Be the first to complete a questionnaire and appear on the leaderboard!
                </p>
              </div>
            ) : (
              <>
                {/* Top 3 Podium */}
                {leaderboard.slice(0, 3).length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                  }}>
                    {leaderboard.slice(0, 3).map((entry, index) => (
                      <div
                        key={entry.username}
                        style={{
                          textAlign: 'center',
                          padding: '24px',
                          borderRadius: '16px',
                          backgroundColor: index === 0 ? '#fef3c7' : 
                                         index === 1 ? '#f3f4f6' : 
                                         '#fce7f3',
                          border: `3px solid ${getRankColor(entry.rank)}`,
                          transform: index === 0 ? 'scale(1.05)' : 'scale(1)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <div style={{
                          fontSize: '3rem',
                          marginBottom: '16px'
                        }}>
                          {getRankIcon(entry.rank)}
                        </div>
                        <h3 style={{
                          color: '#1f2937',
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          marginBottom: '8px'
                        }}>
                          {entry.username}
                        </h3>
                        <div style={{
                          fontSize: '2rem',
                          fontWeight: 'bold',
                          color: getRankColor(entry.rank)
                        }}>
                          {entry.questionnaireCount}
                        </div>
                        <p style={{
                          color: '#6b7280',
                          fontSize: '14px',
                          margin: 0
                        }}>
                          questionnaires
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Full Leaderboard */}
                <div>
                  <h3 style={{
                    color: '#374151',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>
                    Complete Rankings
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {leaderboard.map((entry, index) => (
                      <div
                        key={entry.username}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px 20px',
                          backgroundColor: index < 3 ? '#f8fafc' : 'white',
                          borderRadius: '12px',
                          border: index < 3 ? `2px solid ${getRankColor(entry.rank)}` : '1px solid #e5e7eb',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (index >= 3) {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (index >= 3) {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }
                        }}
                      >
                        <div style={{
                          width: '60px',
                          textAlign: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: getRankColor(entry.rank)
                        }}>
                          {getRankIcon(entry.rank)}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontWeight: '600',
                            color: '#1f2937',
                            fontSize: '16px'
                          }}>
                            {entry.username}
                          </div>
                          {user && user.username === entry.username && (
                            <div style={{
                              fontSize: '12px',
                              color: '#10b981',
                              fontWeight: '500'
                            }}>
                              You
                            </div>
                          )}
                        </div>
                        
                        <div style={{
                          textAlign: 'right'
                        }}>
                          <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#10b981'
                          }}>
                            {entry.questionnaireCount}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#6b7280'
                          }}>
                            completed
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

