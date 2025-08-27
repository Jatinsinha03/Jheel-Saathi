import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

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
}

interface AISummary {
  summary: string;
  generatedAt: string;
  isLoading: boolean;
}

export default function QuestionnairePage() {
  const router = useRouter();
  const { waterBodyId, waterBodyName } = router.query;
  
  const { user } = useAuth();
  const [formData, setFormData] = useState<QuestionnaireFormData>({
    waterBodyId: waterBodyId as string || '',
    waterClarityRating: 3,
    fishPresence: false,
    birdPresence: false,
    otherWildlife: false,
    biodiversityNotes: '',
    vegetationDensity: 3,
    vegetationTypes: [],
    generalNotes: ''
  });

  // Fetch previous questionnaires for this water body
  const [previousQuestionnaires, setPreviousQuestionnaires] = useState<QuestionnaireFormData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // AI Summary state
  const [aiSummary, setAiSummary] = useState<AISummary>({
    summary: '',
    generatedAt: '',
    isLoading: false
  });

  // Print functionality
  const handlePrint = () => {
    const printContent = document.getElementById('print-content');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  // Print empty questionnaire
  const handlePrintEmptyQuestionnaire = () => {
    const printContent = document.getElementById('print-empty-questionnaire');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  useEffect(() => {
    if (waterBodyId) {
      setFormData(prev => ({ ...prev, waterBodyId: waterBodyId as string }));
      fetchPreviousQuestionnaires();
    }
  }, [waterBodyId]);

  useEffect(() => {
    // Generate AI summary whenever previous questionnaires change
    if (previousQuestionnaires.length > 0 && waterBodyId && waterBodyName) {
      generateAISummary();
    }
  }, [previousQuestionnaires, waterBodyId, waterBodyName]);

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

  const generateAISummary = async () => {
    if (!waterBodyId || !waterBodyName) return;
    
    setAiSummary(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await fetch('/api/generate-ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waterBodyId,
          waterBodyName,
          previousAssessments: previousQuestionnaires
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSummary({
          summary: data.summary,
          generatedAt: data.generatedAt,
          isLoading: false
        });
      } else {
        console.error('Failed to generate AI summary');
        setAiSummary(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error generating AI summary:', error);
      setAiSummary(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Format AI summary for better display
  const formatAISummary = (summary: string) => {
    return summary.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove markdown bold formatting
  };

  const vegetationOptions = [
    'Trees', 'Shrubs', 'Grass', 'Aquatic Plants', 'Reeds', 'Moss', 'Ferns', 'Wildflowers'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to submit a questionnaire.');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/questionnaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user.id
        }),
      });

      if (response.ok) {
        alert('Questionnaire submitted successfully!');
        router.push('/');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error submitting questionnaire. Please try again.');
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
            Please log in to access the questionnaire.
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

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', backgroundColor: '#bbdde1', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#1f2937', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
            Water Body Questionnaire
          </h1>
          {waterBodyName && (
            <h2 style={{ color: '#3d73a1', fontSize: '2.2rem', fontWeight: '600', marginBottom: '2rem', textAlign: 'center' }}>
              {waterBodyName}
            </h2>
          )}
        </div>
        <button
          onClick={handlePrint}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🖨️ Print Report
        </button>
      </div>

      {/* Previous Questionnaire Summary */}
      {!loading && previousQuestionnaires.length > 0 ? (
        <div style={{ 
          backgroundColor: '#eef6f9', 
          borderRadius: '12px', 
          padding: '24px', 
          marginBottom: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ color: '#1f2937', fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>
            Previous Assessments Summary ({popularAnswers?.totalResponses} responses)
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
      ) : !loading && (
        <div style={{ 
          backgroundColor: '#eef6f9', 
          borderRadius: '12px', 
          padding: '24px', 
          marginBottom: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ color: '#1f2937', fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>
            📊 No Previous Assessments
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            This lake doesn't have any previous assessments yet. Be the first to submit an assessment!
          </p>
        </div>
      )}

             {/* AI Summary Section - Only show when there are previous assessments */}
       {!loading && previousQuestionnaires.length > 0 && (
         <>
           {aiSummary.isLoading ? (
         <div style={{ 
           backgroundColor: '#eef6f9', 
           borderRadius: '12px', 
           padding: '24px', 
           marginBottom: '32px',
           boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
           border: '1px solid #e5e7eb'
         }}>
           <h3 style={{ color: '#1f2937', fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>
             🤖 Generating AI Summary...
           </h3>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <div style={{
               width: '20px',
               height: '20px',
               border: '2px solid #e5e7eb',
               borderTop: '2px solid #10b981',
               borderRadius: '50%',
               animation: 'spin 1s linear infinite'
             }}></div>
             <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
               Please wait while we process the data to generate an insightful summary.
             </p>
           </div>
         </div>
      ) : aiSummary.summary ? (
        <div style={{ 
          backgroundColor: '#eef6f9', 
          borderRadius: '12px', 
          padding: '24px', 
          marginBottom: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
             <h3 style={{ color: '#1f2937', fontSize: '1.25rem', fontWeight: '600' }}>
               AI Summary for {waterBodyName}
             </h3>
             <button
               onClick={generateAISummary}
               disabled={aiSummary.isLoading}
               style={{
                 backgroundColor: '#10b981',
                 color: 'white',
                 border: 'none',
                 borderRadius: '6px',
                 padding: '8px 16px',
                 cursor: aiSummary.isLoading ? 'not-allowed' : 'pointer',
                 fontSize: '14px',
                 fontWeight: '500',
                 opacity: aiSummary.isLoading ? 0.6 : 1
               }}
             >
               {aiSummary.isLoading ? 'Generating...' : '🔄 Refresh'}
             </button>
           </div>
          <div style={{ 
            color: '#374151', 
            fontSize: '1rem', 
            lineHeight: '1.6',
            whiteSpace: 'pre-line'
          }}>
            {formatAISummary(aiSummary.summary)}
          </div>
          


          {/* Enhanced display for conservation sections */}
          {aiSummary.summary && (
            <div style={{ marginTop: '20px' }}>
              {/* Lake Health Summary */}
              {aiSummary.summary.includes('LAKE HEALTH SUMMARY:') && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ 
                    color: '#1f2937', 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    backgroundColor: '#f0f9ff',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    borderLeft: '4px solid #3b82f6'
                  }}>
                    🌊 Lake Health Summary
                  </h4>
                  <div style={{ 
                    color: '#374151', 
                    fontSize: '0.95rem', 
                    lineHeight: '1.6',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}>
                    {aiSummary.summary.split('LAKE HEALTH SUMMARY:')[1]?.split('CONSERVATION RECOMMENDATIONS:')[0]?.trim() || 'No summary available'}
                  </div>
                </div>
              )}

              {/* Conservation Recommendations */}
              {aiSummary.summary.includes('CONSERVATION RECOMMENDATIONS:') && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ 
                    color: '#1f2937', 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    backgroundColor: '#f0fdf4',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    borderLeft: '4px solid #10b981'
                  }}>
                    🌱 Conservation Recommendations
                  </h4>
                  <div style={{ 
                    color: '#374151', 
                    fontSize: '0.95rem', 
                    lineHeight: '1.6',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}>
                    {aiSummary.summary.split('CONSERVATION RECOMMENDATIONS:')[1]?.split('HOW YOU CAN CONTRIBUTE:')[0]?.trim() || 'No recommendations available'}
                  </div>
                </div>
              )}

              {/* How You Can Contribute */}
              {aiSummary.summary.includes('HOW YOU CAN CONTRIBUTE:') && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ 
                    color: '#1f2937', 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    backgroundColor: '#fef3c7',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    borderLeft: '4px solid #f59e0b'
                  }}>
                    👥 How You Can Contribute
                  </h4>
                  <div style={{ 
                    color: '#374151', 
                    fontSize: '0.95rem', 
                    lineHeight: '1.6',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}>
                    {aiSummary.summary.split('HOW YOU CAN CONTRIBUTE:')[1]?.trim() || 'No contribution suggestions available'}
                  </div>
                </div>
              )}
            </div>
          )}
          <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '8px' }}>
            Generated on: {new Date(aiSummary.generatedAt).toLocaleDateString()}
          </p>
        </div>
      ) : null}
         </>
       )}

      <div style={{ 
        backgroundColor: '#eef6f9', 
        borderRadius: '12px', 
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ color: '#1f2937', fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>
          Submit Your Assessment
        </h3>
        
        <form onSubmit={handleSubmit}>

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
              onClick={handlePrintEmptyQuestionnaire}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              🖨️ Print Form
            </button>
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

      {/* Print Content - Hidden by default */}
      <div id="print-content" style={{ display: 'none' }}>
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ color: '#1f2937', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
            Water Body Assessment Report
          </h1>
          {waterBodyName && (
            <h2 style={{ color: '#3d73a1', fontSize: '20px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>
              {waterBodyName}
            </h2>
          )}
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#1f2937', fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
              Assessment Summary
            </h3>
            {popularAnswers && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  <strong>Average Water Clarity:</strong> {popularAnswers.avgClarity}/5
                </div>
                <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  <strong>Average Vegetation Density:</strong> {popularAnswers.avgVegetation}/5
                </div>
                <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  <strong>Fish Sightings:</strong> {popularAnswers.fishCount}
                </div>
                <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  <strong>Bird Sightings:</strong> {popularAnswers.birdCount}
                </div>
              </div>
            )}
            <p><strong>Total Responses:</strong> {popularAnswers?.totalResponses || 0}</p>
          </div>

          {aiSummary.summary && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#1f2937', fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                AI Analysis Summary
              </h3>
              <div style={{ 
                color: '#374151', 
                fontSize: '14px', 
                lineHeight: '1.5',
                whiteSpace: 'pre-line',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#f9fafb'
              }}>
                {formatAISummary(aiSummary.summary)}
              </div>
              <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '8px' }}>
                Generated on: {new Date(aiSummary.generatedAt).toLocaleDateString()}
              </p>
            </div>
          )}

          <div style={{ marginTop: '30px', borderTop: '2px solid #e5e7eb', paddingTop: '20px' }}>
            <h3 style={{ color: '#1f2937', fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
              Current Assessment Form
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <strong>Water Clarity Rating:</strong> {formData.waterClarityRating}/5
              </div>
              <div>
                <strong>Vegetation Density:</strong> {formData.vegetationDensity}/5
              </div>
              <div>
                <strong>Fish Presence:</strong> {formData.fishPresence ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Bird Presence:</strong> {formData.birdPresence ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Other Wildlife:</strong> {formData.otherWildlife ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Vegetation Types:</strong> {formData.vegetationTypes.join(', ') || 'None'}
              </div>
            </div>
            
            {formData.biodiversityNotes && (
              <div style={{ marginTop: '16px' }}>
                <strong>Biodiversity Notes:</strong>
                <p style={{ marginTop: '4px', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                  {formData.biodiversityNotes}
                </p>
              </div>
            )}
            
            {formData.generalNotes && (
              <div style={{ marginTop: '16px' }}>
                <strong>General Notes:</strong>
                <p style={{ marginTop: '4px', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                  {formData.generalNotes}
                </p>
              </div>
            )}
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
            <p>Report generated by Jheel Saathi - Lake Conservation Platform</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Print Empty Questionnaire Content - Hidden by default */}
      <div id="print-empty-questionnaire" style={{ display: 'none' }}>
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ color: '#1f2937', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
            Water Body Assessment Form
          </h1>
          {waterBodyName && (
            <h2 style={{ color: '#3d73a1', fontSize: '20px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>
              {waterBodyName}
            </h2>
          )}
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#1f2937', fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
              Assessment Form
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
              Use this form to assess the health and condition of the water body. Fill in your observations and submit the completed form.
            </p>
          </div>

          <div style={{ marginTop: '30px', borderTop: '2px solid #e5e7eb', paddingTop: '20px' }}>
            <h3 style={{ color: '#1f2937', fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
              Assessment Checklist
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                <strong>Water Clarity Rating:</strong> ___/5 (1 = Very murky, 5 = Crystal clear)
              </div>
              <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                <strong>Vegetation Density:</strong> ___/5 (1 = Sparse, 5 = Dense vegetation)
              </div>
              <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                <strong>Fish Presence:</strong> □ Yes □ No
              </div>
              <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                <strong>Bird Presence:</strong> □ Yes □ No
              </div>
              <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                <strong>Other Wildlife:</strong> □ Yes □ No
              </div>
              <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                <strong>Vegetation Types:</strong> _________________________________
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Biodiversity Notes:</strong>
              <div style={{ 
                marginTop: '8px', 
                padding: '12px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '6px',
                minHeight: '60px'
              }}>
                _________________________________
                <br />
                _________________________________
                <br />
                _________________________________
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>General Notes:</strong>
              <div style={{ 
                marginTop: '8px', 
                padding: '12px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '6px',
                minHeight: '80px'
              }}>
                _________________________________
                <br />
                _________________________________
                <br />
                _________________________________
                <br />
                _________________________________
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
            <p>Form generated by Jheel Saathi - Lake Conservation Platform</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Location: {waterBodyName || 'Water Body'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
