import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface Company {
  name: string;
  logoUrl: string;
  coordinates: [number, number]; // [lng, lat]
}

interface City {
  name: string;
  coordinates: [number, number]; // [lng, lat]
}

interface CityResult {
  type: 'city';
  name: string;
  coordinates: [number, number];
}

interface CompanyResult {
  type: 'company';
  name: string;
  logoUrl: string;
  coordinates: [number, number];
}

// Cache data to avoid reading files on every request
let dataCache: { companies: Company[]; cities: City[] } | null = null;

function loadData(): { companies: Company[]; cities: City[] } {
  if (!dataCache) {
    try {
      // Read companies data
      const companiesPath = path.join(process.cwd(), 'public', 'final_merged_companies.json');
      const companies = JSON.parse(fs.readFileSync(companiesPath, 'utf-8'));

      // Read cities data
      const citiesPath = path.join(process.cwd(), 'public', 'newcities.json');
      const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));

      dataCache = { companies, cities };
      console.log(`Loaded ${companies.length} companies and ${cities.length} cities into cache`);
    } catch (error) {
      console.error('Failed to load data:', error);
      throw error;
    }
  }
  
  return dataCache;
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
    const { companies, cities } = loadData();
    const searchTerm = q.toLowerCase().trim();
    const results: (CompanyResult | CityResult)[] = [];

    // Search cities first (no distance calculation needed)
    const matchingCities = cities
      .filter(city => city.name.toLowerCase().includes(searchTerm))
      .slice(0, 5) // Limit cities to 5
      .map(city => ({
        type: 'city' as const,
        name: city.name,
        coordinates: city.coordinates
      }));

    results.push(...matchingCities);

    // Search companies (optimized scoring)
    const scoredCompanies = companies
      .map(company => {
        const companyName = company.name.toLowerCase();
        let score = 0;
        
        if (companyName === searchTerm) {
          score = 100;
        } else if (companyName.startsWith(searchTerm)) {
          score = 80;
        } else if (companyName.includes(searchTerm)) {
          score = 60;
        } else if (companyName.split(' ').some(word => word.startsWith(searchTerm))) {
          score = 40;
        }
        
        return { ...company, score };
      })
      .filter(company => company.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20) // Limit companies to 20
      .map(company => ({
        type: 'company' as const,
        name: company.name,
        logoUrl: company.logoUrl,
        coordinates: company.coordinates
      }));

    results.push(...scoredCompanies);

    // Limit total results to 25
    res.status(200).json(results.slice(0, 25));
  } catch (err) {
    console.error('Search failed:', err);
    res.status(500).json({ error: 'Search failed' });
  }
} 