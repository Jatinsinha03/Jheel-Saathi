import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface CompanyFeature {
  properties: {
    cluster?: boolean;
    point_count?: number;
    name: string;
    logoUrl: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface SearchResult {
  name: string;
  logoUrl: string;
  coordinates: [number, number];
}

export default function CompanyMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const customMarkers: maplibregl.Marker[] = [];
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Search functionality
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const results = await response.json();
        setSuggestions(results);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCompanySelect = (company: SearchResult) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: company.coordinates,
        zoom: 20,
        duration: 2000
      });
      
      // Trigger updateClusters after the map finishes moving
      mapRef.current.once('moveend', () => {
        // Longer delay to ensure the map is fully settled and data is loaded
        setTimeout(() => {
          const bounds = mapRef.current!.getBounds();
          const zoom = mapRef.current!.getZoom();
          const bbox = [
            bounds.getWest(),
            bounds.getSouth(),
            bounds.getEast(),
            bounds.getNorth(),
          ];

          fetch(`/api/clusters?bbox=${bbox.join(',')}&zoom=${Math.floor(zoom)}`)
            .then(res => {
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              return res.json();
            })
            .then(data => {
              const source = mapRef.current!.getSource('companies') as maplibregl.GeoJSONSource;
              source.setData(data);
              
              // Clear old markers
              customMarkers.forEach(marker => marker.remove());
              customMarkers.length = 0;

              // Add new markers
              data.features.forEach((feature: CompanyFeature, index: number) => {
                console.log(`Feature ${index}:`, feature);
                console.log(`Feature properties:`, feature.properties);
                console.log(`Is cluster:`, feature.properties.cluster);
                
                if (!feature.properties.cluster) {
                  const { name, logoUrl } = feature.properties;

                  console.log(`Creating marker for: "${name}"`);
                  console.log(`Comparing with selected: "${company.name}"`);
                  console.log(`Match: ${name.toLowerCase() === company.name.toLowerCase()}`);

                  const wrapper = document.createElement('div');
                  wrapper.style.display = 'flex';
                  wrapper.style.flexDirection = 'column';
                  wrapper.style.alignItems = 'center';
                  wrapper.style.textAlign = 'center';

                  const img = document.createElement('img');
                  img.src = logoUrl;
                  img.className = 'marker-logo';
                  img.onerror = () => {
                    img.src = 'https://via.placeholder.com/36';
                  };
                  img.style.width = '36px';
                  img.style.height = '36px';
                  img.style.borderRadius = '50%';
                  img.style.border = '2px solid white';
                  img.style.boxShadow = '0 0 4px rgba(0,0,0,0.4)';
                  img.style.backgroundColor = '#fff';
                  img.style.objectFit = 'cover';

                  const label = document.createElement('div');
                  label.className = 'marker-label';
                  label.textContent = name;
                  label.style.marginTop = '4px';
                  label.style.fontSize = '13px';
                  label.style.fontWeight = 'bold';
                  label.style.color = 'black';
                  label.style.textShadow = '0 1px 2px rgba(255,255,255,0.7)';
                  label.style.background = 'white';
                  label.style.padding = '2px 4px';
                  label.style.borderRadius = '4px';

                  // Highlight the selected company marker (case-insensitive comparison)
                  if (name.toLowerCase() === company.name.toLowerCase()) {
                    console.log(`Highlighting marker for: ${name}`);
                    wrapper.style.transform = 'scale(1.2)';
                    wrapper.style.zIndex = '1000';
                    img.style.border = '3px solid #3b82f6';
                    img.style.boxShadow = '0 0 8px rgba(59,130,246,0.6)';
                    label.style.background = '#3b82f6';
                    label.style.color = 'white';
                    label.style.fontWeight = 'bold';
                  }

                  wrapper.appendChild(img);
                  wrapper.appendChild(label);

                  const marker = new maplibregl.Marker({ element: wrapper })
                    .setLngLat(feature.geometry.coordinates)
                    .addTo(mapRef.current!);

                  customMarkers.push(marker);
                  console.log(`Added marker for: ${name} at coordinates:`, feature.geometry.coordinates);
                } else {
                  console.log(`Skipping clustered feature with ${feature.properties.point_count || 'unknown'} points`);
                  
                  // If we're at high zoom and found a cluster, try to expand it to get individual companies
                  if (zoom >= 18 && feature.properties.cluster && 'id' in feature) {
                    console.log(`Attempting to expand cluster ${feature.id} to find individual companies`);
                    
                    // Make another API call to expand this specific cluster
                    fetch(`/api/clusters?expand=${feature.id}&zoom=${Math.floor(zoom)}`)
                      .then(res => res.json())
                      .then(expandedData => {
                        console.log('Expanded cluster data:', expandedData);
                        
                        if (expandedData.features) {
                          expandedData.features.forEach((expandedFeature: CompanyFeature) => {
                            if (!expandedFeature.properties.cluster) {
                              const { name, logoUrl } = expandedFeature.properties;
                              console.log(`Creating expanded marker for: "${name}"`);
                              
                              const wrapper = document.createElement('div');
                              wrapper.style.display = 'flex';
                              wrapper.style.flexDirection = 'column';
                              wrapper.style.alignItems = 'center';
                              wrapper.style.textAlign = 'center';

                              const img = document.createElement('img');
                              img.src = logoUrl;
                              img.className = 'marker-logo';
                              img.onerror = () => {
                                img.src = 'https://via.placeholder.com/36';
                              };
                              img.style.width = '36px';
                              img.style.height = '36px';
                              img.style.borderRadius = '50%';
                              img.style.border = '2px solid white';
                              img.style.boxShadow = '0 0 4px rgba(0,0,0,0.4)';
                              img.style.backgroundColor = '#fff';
                              img.style.objectFit = 'cover';

                              const label = document.createElement('div');
                              label.className = 'marker-label';
                              label.textContent = name;
                              label.style.marginTop = '4px';
                              label.style.fontSize = '13px';
                              label.style.fontWeight = 'bold';
                              label.style.color = 'black';
                              label.style.textShadow = '0 1px 2px rgba(255,255,255,0.7)';
                              label.style.background = 'white';
                              label.style.padding = '2px 4px';
                              label.style.borderRadius = '4px';

                              // Highlight the selected company marker
                              if (name.toLowerCase() === company.name.toLowerCase()) {
                                console.log(`Highlighting expanded marker for: ${name}`);
                                wrapper.style.transform = 'scale(1.2)';
                                wrapper.style.zIndex = '1000';
                                img.style.border = '3px solid #3b82f6';
                                img.style.boxShadow = '0 0 8px rgba(59,130,246,0.6)';
                                label.style.background = '#3b82f6';
                                label.style.color = 'white';
                                label.style.fontWeight = 'bold';
                              }

                              wrapper.appendChild(img);
                              wrapper.appendChild(label);

                              const marker = new maplibregl.Marker({ element: wrapper })
                                .setLngLat(expandedFeature.geometry.coordinates)
                                .addTo(mapRef.current!);

                              customMarkers.push(marker);
                              console.log(`Added expanded marker for: ${name}`);
                            }
                          });
                        }
                      })
                      .catch(error => {
                        console.error('Error expanding cluster:', error);
                      });
                  }
                }
              });
              
              console.log(`Loaded ${data.features.length} features, looking for: ${company.name}`);
              console.log('Features data:', data.features);
            })
            .catch(error => {
              console.error('Error fetching clusters after navigation:', error);
            });
        }, 300);
      });
    }
    setSearchQuery(company.name);
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [78.96, 20.59],
      zoom: 3,
    });

    mapRef.current = map;

    map.on('load', () => {
      map.addSource('companies', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'companies',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#0074D9',
          'circle-radius': ['step', ['get', 'point_count'], 15, 100, 20, 750, 30],
        },
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'companies',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-size': 12,
        },
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'companies',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#FF4136',
          'circle-radius': 0,
        },
      });

      const clearOldMarkers = () => {
        customMarkers.forEach(marker => marker.remove());
        customMarkers.length = 0;
      };

      const updateClusters = () => {
        const bounds = map.getBounds();
        const zoom = map.getZoom();
        const bbox = [
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth(),
        ];

        fetch(`/api/clusters?bbox=${bbox.join(',')}&zoom=${Math.floor(zoom)}`)
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            const source = map.getSource('companies') as maplibregl.GeoJSONSource;
            source.setData(data);
            clearOldMarkers();

            data.features.forEach((feature: CompanyFeature) => {
              if (!feature.properties.cluster) {
                const { name, logoUrl } = feature.properties;

                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                wrapper.style.flexDirection = 'column';
                wrapper.style.alignItems = 'center';
                wrapper.style.textAlign = 'center';

                const img = document.createElement('img');
                img.src = logoUrl;
                img.className = 'marker-logo';
                img.onerror = () => {
                  img.src = 'https://via.placeholder.com/36';
                };
                img.style.width = '36px';
                img.style.height = '36px';
                img.style.borderRadius = '50%';
                img.style.border = '2px solid white';
                img.style.boxShadow = '0 0 4px rgba(0,0,0,0.4)';
                img.style.backgroundColor = '#fff';
                img.style.objectFit = 'cover';

                const label = document.createElement('div');
                label.className = 'marker-label';
                label.textContent = name;
                label.style.marginTop = '4px';
                label.style.fontSize = '13px';
                label.style.fontWeight = 'bold';
                label.style.color = 'black';
                label.style.textShadow = '0 1px 2px rgba(255,255,255,0.7)';
                label.style.background = 'white';
                label.style.padding = '2px 4px';
                label.style.borderRadius = '4px';

                wrapper.appendChild(img);
                wrapper.appendChild(label);

                const marker = new maplibregl.Marker({ element: wrapper })
                  .setLngLat(feature.geometry.coordinates)
                  .addTo(map);

                customMarkers.push(marker);
              }
            });
          })
          .catch(error => {
            console.error('Error fetching clusters:', error);
            const source = map.getSource('companies') as maplibregl.GeoJSONSource;
            source.setData({ type: 'FeatureCollection', features: [] });
          });
      };

      updateClusters();
      map.on('moveend', updateClusters);
    });
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Search Bar */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        zIndex: 1000,
        maxWidth: '400px'
      }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            onFocus={(e) => {
              if (suggestions.length > 0) setShowSuggestions(true);
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 6px 25px rgba(59,130,246,0.15)';
            }}
            onBlur={(e) => {
              setTimeout(() => setShowSuggestions(false), 200);
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
            }}
            placeholder="Search for companies..."
            style={{
              width: '100%',
              padding: '14px 18px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#1f2937',
              backgroundColor: '#ffffff',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              outline: 'none',
              transition: 'all 0.2s ease-in-out'
            }}
          />
          
          {isSearching && (
            <div style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Searching...
            </div>
          )}

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              border: '2px solid #e5e7eb',
              borderTop: 'none',
              borderRadius: '0 0 12px 12px',
              boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {suggestions.map((company, index) => (
                <div
                  key={index}
                  onClick={() => handleCompanySelect(company)}
                  style={{
                    padding: '14px 18px',
                    cursor: 'pointer',
                    borderBottom: index < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: '#ffffff',
                    transition: 'background-color 0.15s ease-in-out'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #f3f4f6'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/28';
                    }}
                  />
                  <span style={{ 
                    fontSize: '15px', 
                    fontWeight: '500',
                    color: '#1f2937'
                  }}>
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div id="map" ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
}
