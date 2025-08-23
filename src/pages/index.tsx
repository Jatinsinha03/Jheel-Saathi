import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Questionnaire {
  id: string;
  waterClarityRating: number;
  fishPresence: boolean;
  birdPresence: boolean;
  otherWildlife: boolean;
  biodiversityNotes: string;
  vegetationDensity: number;
  vegetationTypes: string[];
  generalNotes: string;
  userName: string;
  createdAt: string;
}

interface WaterBody {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  questionnaires?: Questionnaire[];
}

interface WaterBodyDetails {
  id: string;
  name: string;
  description?: string;
  questionnaires?: Questionnaire[];
}

export default function WaterBodyMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [waterBodies, setWaterBodies] = useState<WaterBody[]>([]);
  const [selectedWaterBody, setSelectedWaterBody] = useState<WaterBodyDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WaterBody[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    description: ''
  });

  // Fetch water bodies
  const fetchWaterBodies = async () => {
    try {
      const response = await fetch('/api/water-bodies');
      if (response.ok) {
        const data = await response.json();
        setWaterBodies(data);
      }
    } catch (error) {
      console.error('Error fetching water bodies:', error);
    }
  };

  // Add new water body
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/water-bodies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddForm(false);
        setFormData({ name: '', latitude: '', longitude: '', description: '' });
        fetchWaterBodies();
      }
    } catch (error) {
      console.error('Error adding water body:', error);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = waterBodies.filter(waterBody =>
      waterBody.name.toLowerCase().includes(query.toLowerCase()) ||
      (waterBody.description && waterBody.description.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  const handleSearchResultClick = (waterBody: WaterBody) => {
    setSelectedWaterBody(waterBody);
    setShowSearchResults(false);
    setSearchQuery(waterBody.name);
    
    // Fly to the water body on the map
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [waterBody.longitude, waterBody.latitude],
        zoom: 15,
        duration: 2000
      });
    }
  };

  // Calculate community insights
  const getCommunityInsights = (questionnaires: Questionnaire[] = []) => {
    if (questionnaires.length === 0) return null;

    const clarityRatings = questionnaires.map(q => q.waterClarityRating);
    const vegetationDensities = questionnaires.map(q => q.vegetationDensity);
    
    const avgClarity = Math.round(clarityRatings.reduce((a, b) => a + b, 0) / clarityRatings.length);
    const avgVegetation = Math.round(vegetationDensities.reduce((a, b) => a + b, 0) / vegetationDensities.length);
    
    const fishCount = questionnaires.filter(q => q.fishPresence).length;
    const birdCount = questionnaires.filter(q => q.birdPresence).length;
    const wildlifeCount = questionnaires.filter(q => q.otherWildlife).length;
    
    const allNotes = questionnaires
      .filter(q => q.generalNotes && q.generalNotes.trim())
      .map(q => q.generalNotes)
      .slice(0, 5);

    return {
      avgClarity,
      avgVegetation,
      fishCount,
      birdCount,
      wildlifeCount,
      totalResponses: questionnaires.length,
      topNotes: allNotes
    };
  };

  useEffect(() => {
    fetchWaterBodies();
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [-98.5795, 39.8283],
      zoom: 4,
    });

    mapRef.current = map;

    map.on('load', () => {
      // Add water body markers
      waterBodies.forEach(waterBody => {
        const marker = new maplibregl.Marker({ color: '#10b981' })
          .setLngLat([waterBody.longitude, waterBody.latitude])
          .addTo(map);

        // Add click event to marker
        marker.getElement().addEventListener('click', () => {
          setSelectedWaterBody(waterBody);
        });
      });
    });
  }, [waterBodies]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex' }}>
      {/* Left side - Map and Controls */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Add Water Body Button */}
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
        >
          🌊 Add Water Body
        </button>

        {/* Search Bar */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '80px',
          zIndex: 1000,
          width: '300px'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search water bodies..."
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '2px solid #e5e7eb',
                borderTop: 'none',
                borderRadius: '0 0 8px 8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 1001
              }}>
                {searchResults.map((waterBody, index) => (
                  <div
                    key={waterBody.id}
                    onClick={() => handleSearchResultClick(waterBody)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: index < searchResults.length - 1 ? '1px solid #f3f4f6' : 'none',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>{waterBody.name}</div>
                    {waterBody.description && (
                      <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                        {waterBody.description.substring(0, 60)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div id="map" ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
      </div>

      {/* Right side - Water Body Details Panel */}
      {selectedWaterBody && (
        <div style={{
          width: '400px',
          backgroundColor: 'white',
          borderLeft: '1px solid #e5e7eb',
          overflowY: 'auto',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ 
                margin: 0, 
                color: '#1f2937', 
                fontSize: '1.5rem', 
                fontWeight: '600' 
              }}>
                {selectedWaterBody.name}
              </h2>
              <button
                onClick={() => setSelectedWaterBody(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            {/* Description */}
            {selectedWaterBody.description && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  color: '#374151', 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  marginBottom: '8px' 
                }}>
                  Description
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '14px', 
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {selectedWaterBody.description}
                </p>
              </div>
            )}

            {/* Community Insights */}
            {selectedWaterBody.questionnaires && selectedWaterBody.questionnaires.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  color: '#374151', 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  marginBottom: '16px' 
                }}>
                  📊 Community Insights ({selectedWaterBody.questionnaires.length} assessments)
                </h3>
                
                {(() => {
                  const insights = getCommunityInsights(selectedWaterBody.questionnaires);
                  if (!insights) return null;

                  return (
                    <>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '12px', 
                        marginBottom: '20px' 
                      }}>
                        <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1' }}>{insights.avgClarity}/5</div>
                          <div style={{ color: '#374151', fontSize: '12px' }}>Avg. Water Clarity</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '6px' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{insights.avgVegetation}/5</div>
                          <div style={{ color: '#374151', fontSize: '12px' }}>Avg. Vegetation</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>{insights.fishCount}</div>
                          <div style={{ color: '#374151', fontSize: '12px' }}>Fish Sightings</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#fce7f3', borderRadius: '6px' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#be185d' }}>{insights.birdCount}</div>
                          <div style={{ color: '#374151', fontSize: '12px' }}>Bird Sightings</div>
                        </div>
                      </div>

                      {insights.topNotes && insights.topNotes.length > 0 && (
                        <div>
                          <h4 style={{ 
                            color: '#374151', 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            marginBottom: '8px' 
                          }}>
                            📝 Recent Observations
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {insights.topNotes.map((note, index) => (
                                                             <div key={index} style={{ 
                                 padding: '8px', 
                                 backgroundColor: '#f9fafb', 
                                 borderRadius: '4px',
                                 border: '1px solid #e5e7eb',
                                 color: '#374151',
                                 fontSize: '12px',
                                 lineHeight: '1.4'
                               }}>
                                 &ldquo;{note}&rdquo;
                               </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={`/questionnaire?waterBodyId=${selectedWaterBody.id}&waterBodyName=${encodeURIComponent(selectedWaterBody.name)}`}
                style={{
                  flex: 1,
                  backgroundColor: '#10b981',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: '500',
                  fontSize: '16px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                📝 Add Assessment
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add Water Body Form Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ margin: '0 0 24px 0', color: '#1f2937', fontSize: '1.5rem', fontWeight: '600' }}>
              Add New Water Body
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '16px' }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    marginTop: '4px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#374151',
                    backgroundColor: 'white'
                  }}
                  placeholder="e.g., Crystal Lake"
                />
              </div>

              <button
                type="button"
                onClick={getCurrentLocation}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  marginBottom: '16px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                📍 Use Current Location
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '16px' }}>
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      marginTop: '4px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      color: '#374151',
                      backgroundColor: 'white'
                    }}
                    placeholder="e.g., 39.0968"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '16px' }}>
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      marginTop: '4px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      color: '#374151',
                      backgroundColor: 'white'
                    }}
                    placeholder="e.g., -120.0324"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '16px' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    marginTop: '4px', 
                    minHeight: '80px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#374151',
                    backgroundColor: 'white',
                    resize: 'vertical'
                  }}
                  placeholder="Describe the water body..."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                >
                  Add Water Body
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
