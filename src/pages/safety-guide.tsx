import { useRouter } from 'next/router';

export default function SafetyGuidePage() {
  const router = useRouter();

  const safetyGuidelines = [
    {
      icon: '👨‍👩‍👧',
      title: 'Always Have an Adult with You',
      description: 'Children must be accompanied by a parent, teacher, or guardian during field visits. Never visit lakes or wetlands alone.',
      color: '#10b981'
    },
    {
      icon: '🚫',
      title: 'Avoid Unsafe Areas',
      description: 'Stay away from steep or slippery banks, deep water zones, and areas with "No Entry" signs. Do not explore abandoned or unmarked water bodies.',
      color: '#ef4444'
    },
    {
      icon: '📍',
      title: 'Plan Before You Go',
      description: 'Use school/NGO-organized trips or community walks instead of random exploration. Check maps and local safety conditions before heading out.',
      color: '#3b82f6'
    },
    {
      icon: '🧢',
      title: 'Carry Essentials',
      description: 'Comfortable shoes, water bottle, sunscreen, hat, and basic first-aid. A fully charged phone or a way to contact family/teachers.',
      color: '#f59e0b'
    },
    {
      icon: '👥',
      title: 'Group Work is Best',
      description: 'Go in pairs or teams; this makes exploration safer and more fun. Teachers and parents can form "Lake Safety Groups" to supervise outings.',
      color: '#8b5cf6'
    },
    {
      icon: '🏡',
      title: 'Indoor Learning Counts Too!',
      description: 'Complete quizzes, puzzles, or biodiversity bingos from home.',
      color: '#06b6d4'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#bbdde1',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            color: '#1f2937',
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            🛡️ Jheel Saathi Safety Guide
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1.25rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            For Safe and Responsible Lake Exploration
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem'
            }}>
              🌊
            </div>
            <h2 style={{
              color: '#1f2937',
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Your Safety is Our Priority
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Exploring lakes and water bodies can be exciting and educational, but safety should always come first. 
              Follow these guidelines to ensure a safe and enjoyable experience.
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '2rem'
        }}>
          {safetyGuidelines.map((guideline, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: `3px solid ${guideline.color}`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Pattern */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                backgroundColor: guideline.color,
                opacity: 0.1,
                borderRadius: '50%'
              }}></div>

              {/* Icon */}
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {guideline.icon}
              </div>

              {/* Title */}
              <h3 style={{
                color: '#1f2937',
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                {guideline.title}
              </h3>

              {/* Description */}
              <p style={{
                color: '#6b7280',
                fontSize: '1rem',
                lineHeight: '1.6',
                textAlign: 'center'
              }}>
                {guideline.description}
              </p>

              {/* Safety Number */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                width: '32px',
                height: '32px',
                backgroundColor: guideline.color,
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: '#fef3c7',
          borderRadius: '16px',
          padding: '32px',
          border: '2px solid #fde68a',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '2rem',
              marginRight: '16px'
            }}>
              ⚠️
            </div>
            <h3 style={{
              color: '#92400e',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Emergency Contacts
            </h3>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #fde68a'
            }}>
              <div style={{
                fontWeight: '600',
                color: '#92400e',
                marginBottom: '8px'
              }}>
                🚨 Emergency Services
              </div>
              <div style={{
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                Call 100 for police, 101 for fire, 102 for ambulance
              </div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #fde68a'
            }}>
              <div style={{
                fontWeight: '600',
                color: '#92400e',
                marginBottom: '8px'
              }}>
                🏥 Local Hospital
              </div>
              <div style={{
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                Keep local hospital contact numbers handy
              </div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #fde68a'
            }}>
              <div style={{
                fontWeight: '600',
                color: '#92400e',
                marginBottom: '8px'
              }}>
                👨‍👩‍👧 Parent/Guardian
              </div>
              <div style={{
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                Always inform parents before going to water bodies
              </div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f0fdf4',
          borderRadius: '16px',
          padding: '32px',
          border: '2px solid #bbf7d0',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '2rem',
              marginRight: '16px'
            }}>
              ✅
            </div>
            <h3 style={{
              color: '#065f46',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Safety Checklist
            </h3>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {[
              '✅ Adult supervision confirmed',
              '✅ Safe location identified',
              '✅ Weather conditions checked',
              '✅ Emergency contacts saved',
              '✅ First aid kit packed',
              '✅ Comfortable footwear worn',
              '✅ Sun protection applied',
              '✅ Water bottle filled',
              '✅ Phone fully charged',
              '✅ Group size appropriate'
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0',
                  fontSize: '0.875rem',
                  color: '#065f46',
                  fontWeight: '500'
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '3rem'
        }}>
          <button
            onClick={() => router.push('/')}
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
            🏠 Back to Home
          </button>
          <button
            onClick={() => router.push('/quiz')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '16px 32px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '500'
            }}
          >
            🌊 Take Safety Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
