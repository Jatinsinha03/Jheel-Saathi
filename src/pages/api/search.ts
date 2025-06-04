import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface Company {
  name: string;
  logoUrl: string;
  coordinates: [number, number]; // [lng, lat]
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing search query' });
  }

  try {
    const dataPath = path.join(process.cwd(), 'public', 'final_merged_companies.json');
    const companies: Company[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    const searchTerm = q.toLowerCase().trim();
    
    // Filter and score companies based on match quality
    const scoredCompanies = companies
      .map(company => {
        const companyName = company.name.toLowerCase();
        let score = 0;
        
        // Exact match gets highest score
        if (companyName === searchTerm) {
          score = 100;
        }
        // Starts with search term gets high score
        else if (companyName.startsWith(searchTerm)) {
          score = 80;
        }
        // Contains search term gets medium score
        else if (companyName.includes(searchTerm)) {
          score = 60;
        }
        // Word boundary matches get lower score
        else if (companyName.split(' ').some(word => word.startsWith(searchTerm))) {
          score = 40;
        }
        
        return { ...company, score };
      })
      .filter(company => company.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 25) // Increased from 10 to 25 suggestions
      .map(company => ({
        name: company.name,
        logoUrl: company.logoUrl,
        coordinates: company.coordinates
      }));

    res.status(200).json(scoredCompanies);
  } catch (err) {
    console.error('Search failed:', err);
    res.status(500).json({ error: 'Search failed' });
  }
} 