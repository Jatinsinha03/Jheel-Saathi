import { useRouter } from 'next/router';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'link';
  url: string;
  icon: string;
  category: string;
}

export default function ResourcesPage() {
  const router = useRouter();

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Lake Conservation Guide',
      description: 'Comprehensive guide on lake conservation practices and techniques',
      type: 'pdf',
      url: '/rejuvenation-water.pdf',
      icon: '📚',
      category: 'Conservation'
    },
    {
      id: '2',
      title: 'Water Quality Assessment Manual',
      description: 'Step-by-step manual for assessing water quality in lakes and ponds',
      type: 'pdf',
      url: '/1752140894.pdf',
      icon: '🔬',
      category: 'Assessment'
    },
    {
      id: '3',
      title: 'Biodiversity in Freshwater Ecosystems',
      description: 'Understanding the diverse life forms in lake ecosystems',
      type: 'pdf',
      url: '/1739278384.pdf',
      icon: '🐟',
      category: 'Biodiversity'
    },
    {
      id: '4',
      title: 'Lake Restoration Techniques',
      description: 'Modern techniques for restoring degraded lake ecosystems',
      type: 'pdf',
      url: '/NPCA-guidelines-2024-Wetlands.pdf',
      icon: '🌱',
      category: 'Restoration'
    },
    {
      id: '5',
      title: 'Community Lake Monitoring',
      description: 'How communities can participate in lake monitoring programs',
      type: 'pdf',
      url: '/community-monitoring.pdf',
      icon: '👥',
      category: 'Community'
    },
    {
      id: '6',
      title: 'Sustainable Lake Management',
      description: 'Best practices for sustainable lake management and governance',
      type: 'pdf',
      url: '/Designated_Best_Use_Water_Quality_Criteria.pdf',
      icon: '🌍',
      category: 'Management'
    },
    {
      id: '7',
      title: 'World Wildlife Fund - Freshwater',
      description: 'Global freshwater conservation initiatives and resources',
      type: 'link',
      url: 'https://www.worldwildlife.org/habitats/freshwater',
      icon: '🌊',
      category: 'Global'
    },
    {
      id: '8',
      title: 'Ramsar Convention on Wetlands',
      description: 'International treaty for the conservation of wetlands',
      type: 'link',
      url: 'https://cpcb.nic.in/',
      icon: '🦆',
      category: 'International'
    },
    {
      id: '9',
      title: 'LakeNet - Global Lake Network',
      description: 'Network of organizations working on lake conservation worldwide',
      type: 'link',
      url: 'https://nwm.gov.in/',
      icon: '🌐',
      category: 'Network'
    },
    {
      id: '10',
      title: 'UNEP Freshwater Portal',
      description: 'United Nations Environment Programme freshwater resources',
      type: 'link',
      url: 'https://www.jalshakti-dowr.gov.in/',
      icon: '🇺🇳',
      category: 'UN'
    }
  ];

  const categories = ['All', 'Conservation', 'Assessment', 'Biodiversity', 'Restoration', 'Community', 'Management', 'Global', 'International', 'Network', 'UN'];

  const handleResourceClick = (resource: Resource) => {
    if (resource.type === 'pdf') {
      // For PDFs, open in new tab
      window.open(resource.url, '_blank');
    } else {
      // For links, open in new tab
      window.open(resource.url, '_blank');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Conservation': '#10b981',
      'Assessment': '#3b82f6',
      'Biodiversity': '#8b5cf6',
      'Restoration': '#f59e0b',
      'Community': '#ef4444',
      'Management': '#06b6d4',
      'Global': '#84cc16',
      'International': '#f97316',
      'Network': '#ec4899',
      'UN': '#6366f1'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#bbdde1',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
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
            📚 Learning Resources
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1.25rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Explore comprehensive resources about lakes, water bodies, and conservation practices
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: '#1f2937',
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}>
            🎯 Resource Categories
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {categories.map(category => (
              <div
                key={category}
                style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = getCategoryColor(category);
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              >
                <div style={{
                  fontSize: '1.5rem',
                  marginBottom: '8px'
                }}>
                  {category === 'All' ? '📚' : 
                   category === 'Conservation' ? '🌱' :
                   category === 'Assessment' ? '🔬' :
                   category === 'Biodiversity' ? '🐟' :
                   category === 'Restoration' ? '🔄' :
                   category === 'Community' ? '👥' :
                   category === 'Management' ? '🌍' :
                   category === 'Global' ? '🌊' :
                   category === 'International' ? '🦆' :
                   category === 'Network' ? '🌐' :
                   category === 'UN' ? '🇺🇳' : '📄'}
                </div>
                <div style={{
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {category}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginTop: '4px'
                }}>
                  {category === 'All' ? resources.length :
                   resources.filter(r => r.category === category).length} resources
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {resources.map((resource) => (
            <div
              key={resource.id}
              onClick={() => handleResourceClick(resource)}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid transparent',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = getCategoryColor(resource.category);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              {/* Category Badge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: getCategoryColor(resource.category),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {resource.category}
              </div>

              {/* Resource Icon */}
              <div style={{
                fontSize: '3rem',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                {resource.icon}
              </div>

              {/* Resource Type Badge */}
              <div style={{
                display: 'inline-block',
                backgroundColor: resource.type === 'pdf' ? '#ef4444' : '#3b82f6',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                {resource.type.toUpperCase()}
              </div>

              {/* Title */}
              <h3 style={{
                color: '#1f2937',
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '12px',
                lineHeight: '1.4'
              }}>
                {resource.title}
              </h3>

              {/* Description */}
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                marginBottom: '16px'
              }}>
                {resource.description}
              </p>

              {/* Action Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                {resource.type === 'pdf' ? '📄 View PDF' : '🔗 Visit Link'}
                <span style={{ fontSize: '1rem' }}>
                  {resource.type === 'pdf' ? '📄' : '🔗'}
                </span>
              </div>
            </div>
          ))}
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
              fontWeight: '500'
            }}
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
