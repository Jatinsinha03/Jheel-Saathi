import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { waterBodyId, waterBodyName, previousAssessments } = req.body;

    if (!waterBodyId || !waterBodyName) {
      return res.status(400).json({ error: 'Water body ID and name are required' });
    }

    // Get Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Prepare the prompt for AI summary generation
    const prompt = `
You are an environmental expert analyzing lake assessment data. Generate a comprehensive, well-formatted summary and conservation recommendations based on the following data:

Lake Name: ${waterBodyName}
Total Assessments: ${previousAssessments?.length || 0}

Previous Assessment Data:
${previousAssessments?.map((assessment: any, index: number) => `
Assessment ${index + 1}:
- Water Clarity: ${assessment.waterClarityRating}/5
- Fish Presence: ${assessment.fishPresence ? 'Yes' : 'No'}
- Bird Presence: ${assessment.birdPresence ? 'Yes' : 'No'}
- Other Wildlife: ${assessment.otherWildlife ? 'Yes' : 'No'}
- Vegetation Density: ${assessment.vegetationDensity}/5
- Vegetation Types: ${assessment.vegetationTypes?.join(', ') || 'None'}
- Biodiversity Notes: ${assessment.biodiversityNotes || 'None'}
- General Notes: ${assessment.generalNotes || 'None'}
`).join('\n')}

Please provide a comprehensive analysis in the following format:

LAKE HEALTH SUMMARY:
[Provide a concise summary (4-5 lines) of the lake's ecological status, water quality, biodiversity, and overall health assessment]

CONSERVATION RECOMMENDATIONS:
[Provide 3-4 specific, actionable recommendations for protecting and improving this water body. Focus on practical steps that individuals and communities can take]

HOW YOU CAN CONTRIBUTE:
[Provide 3-4 specific ways that users can personally contribute to the conservation of this water body, including citizen science opportunities, community involvement, and individual actions]

Format the response with clear sections and bullet points for recommendations. Make it engaging, practical, and actionable for both environmentalists and the general public. Keep each section concise but informative.
`;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return res.status(200).json({ 
      summary,
      waterBodyId,
      waterBodyName,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating AI summary:', error);
    return res.status(500).json({ 
      error: 'Failed to generate AI summary',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
