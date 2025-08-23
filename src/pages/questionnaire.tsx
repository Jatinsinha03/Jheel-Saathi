import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface QuestionnaireFormData {
  waterBodyId: string;
  waterClarityRating: number;
  fishPresence: boolean;
  birdPresence: boolean;
  otherWildlife: boolean;
  biodiversityNotes: string;
  vegetationDensity: number;
  vegetationTypes: string[];
  generalNotes: string;
  userName: string;
}

export default function QuestionnairePage() {
  const router = useRouter();
  const { waterBodyId, waterBodyName } = router.query;
  
  const [formData, setFormData] = useState<QuestionnaireFormData>({
    waterBodyId: waterBodyId as string || '',
    waterClarityRating: 3,
    fishPresence: false,
    birdPresence: false,
    otherWildlife: false,
    biodiversityNotes: '',
    vegetationDensity: 3,
    vegetationTypes: [],
    generalNotes: '',
    userName: ''
  });

  // Fetch previous questionnaires for this water body
  const [previousQuestionnaires, setPreviousQuestionnaires] = useState<QuestionnaireFormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (waterBodyId) {
      setFormData(prev => ({ ...prev, waterBodyId: waterBodyId as string }));
      fetchPreviousQuestionnaires();
    }
  }, [waterBodyId]);

  const fetchPreviousQuestionnaires = async () => {
    try {
      const response = await fetch(`/api/questionnaires?waterBodyId=${waterBodyId}`);
      if (response.ok) {
        const data = await response.json();
        setPreviousQuestionnaires(data);
      }
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const vegetationOptions = [
    'Trees', 'Shrubs', 'Grass', 'Aquatic Plants', 'Reeds', 'Moss', 'Ferns', 'Wildflowers'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/questionnaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Questionnaire submitted successfully!');
        router.push('/');
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      alert('Error submitting questionnaire. Please try again.');
    }
  };

  // Calculate popular answers
  const getPopularAnswers = () => {
    if (previousQuestionnaires.length === 0) return null;

    const clarityRatings = previousQuestionnaires.map(q => q.waterClarityRating);
    const vegetationDensities = previousQuestionnaires.map(q => q.vegetationDensity);
    
    const avgClarity = Math.round(clarityRatings.reduce((a, b) => a + b, 0) / clarityRatings.length);
    const avgVegetation = Math.round(vegetationDensities.reduce((a, b) => a + b, 0) / vegetationDensities.length);
    
    const fishCount = previousQuestionnaires.filter(q => q.fishPresence).length;
    const birdCount = previousQuestionnaires.filter(q => q.birdPresence).length;
    const wildlifeCount = previousQuestionnaires.filter(q => q.otherWildlife).length;
    
    const allNotes = previousQuestionnaires
      .filter(q => q.generalNotes && q.generalNotes.trim())
      .map(q => q.generalNotes)
      .slice(0, 5);

    return {
      avgClarity,
      avgVegetation,
      fishCount,
      birdCount,
      wildlifeCount,
      totalResponses: previousQuestionnaires.length,
      topNotes: allNotes
    };
  };

  const popularAnswers = getPopularAnswers();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ color: '#1f2937', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
        🌊 Water Body Questionnaire
      </h1>
      {waterBodyName && (
        <h2 style={{ color: '#374151', fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem', textAlign: 'center' }}>
          For: {waterBodyName}
        </h2>
      )}

      {/* Previous Questionnaire Summary */}
      {!loading && previousQuestionnaires.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px', 
          marginBottom: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ color: '#1f2937', fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>
            📊 Previous Assessments Summary ({popularAnswers?.totalResponses} responses)
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0369a1' }}>{popularAnswers?.avgClarity}/5</div>
              <div style={{ color: '#374151', fontSize: '0.875rem' }}>Avg. Water Clarity</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>{popularAnswers?.avgVegetation}/5</div>
              <div style={{ color: '#374151', fontSize: '0.875rem' }}>Avg. Vegetation Density</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>{popularAnswers?.fishCount}</div>
              <div style={{ color: '#374151', fontSize: '0.875rem' }}>Fish Sightings</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fce7f3', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#be185d' }}>{popularAnswers?.birdCount}</div>
              <div style={{ color: '#374151', fontSize: '0.875rem' }}>Bird Sightings</div>
            </div>
          </div>

          {popularAnswers?.topNotes && popularAnswers.topNotes.length > 0 && (
            <div>
              <h4 style={{ color: '#374151', fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>
                📝 Top Observations
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {popularAnswers.topNotes.map((note, index) => (
                  <div key={index} style={{ 
                    padding: '12px', 
                    backgroundColor: '#f9fafb', 
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    &quot;{note}&quot;
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ color: '#1f2937', fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>
          📝 Submit Your Assessment
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Your Name
            </label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                fontSize: '16px',
                color: '#374151',
                backgroundColor: 'white'
              }}
              placeholder="Enter your name (optional)"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Water Clarity Rating (1-5) *
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, waterClarityRating: rating }))}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: formData.waterClarityRating === rating ? '2px solid #10b981' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: formData.waterClarityRating === rating ? '#10b981' : 'white',
                    color: formData.waterClarityRating === rating ? 'white' : '#374151',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  {rating}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              1 = Very murky, 5 = Crystal clear
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Biodiversity Presence
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { key: 'fishPresence', label: '🐟 Fish present' },
                { key: 'birdPresence', label: '🦅 Birds present' },
                { key: 'otherWildlife', label: '🦌 Other wildlife present' }
              ].map(({ key, label }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#374151' }}>
                  <input
                    type="checkbox"
                    checked={formData[key as keyof QuestionnaireFormData] as boolean}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      [key]: e.target.checked 
                    }))}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Biodiversity Notes
            </label>
            <textarea
              value={formData.biodiversityNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, biodiversityNotes: e.target.value }))}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                minHeight: '60px',
                fontSize: '16px',
                color: '#374151',
                backgroundColor: 'white'
              }}
              placeholder="Describe any wildlife you observed..."
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Vegetation Density (1-5) *
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map(density => (
                <button
                  key={density}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, vegetationDensity: density }))}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: formData.vegetationDensity === density ? '2px solid #10b981' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: formData.vegetationDensity === density ? '#10b981' : 'white',
                    color: formData.vegetationDensity === density ? 'white' : '#374151',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  {density}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              1 = Sparse, 5 = Dense vegetation
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Vegetation Types
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
              {vegetationOptions.map(type => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#374151' }}>
                  <input
                    type="checkbox"
                    checked={formData.vegetationTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ 
                          ...prev, 
                          vegetationTypes: [...prev.vegetationTypes, type] 
                        }));
                      } else {
                        setFormData(prev => ({ 
                          ...prev, 
                          vegetationTypes: prev.vegetationTypes.filter(t => t !== type) 
                        }));
                      }
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              General Notes
            </label>
            <textarea
              value={formData.generalNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, generalNotes: e.target.value }))}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                minHeight: '80px',
                fontSize: '16px',
                color: '#374151',
                backgroundColor: 'white'
              }}
              placeholder="Any additional observations or notes..."
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => router.push('/')}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
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
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Submit Questionnaire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
