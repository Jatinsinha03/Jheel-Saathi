import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface City {
  name: string;
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
    // Read cities data
    const citiesPath = path.join(process.cwd(), 'public', 'newcities.json');
    const cities: City[] = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));

    const searchTerm = q.toLowerCase().trim();

    // Search cities
    const matchingCities = cities
      .filter(city => city.name.toLowerCase().includes(searchTerm))
      .slice(0, 25) // Limit to 25 cities
      .map(city => ({
        type: 'city' as const,
        name: city.name,
        coordinates: city.coordinates
      }));

    res.status(200).json(matchingCities);
  } catch (err) {
    console.error('City search failed:', err);
    res.status(500).json({ error: 'City search failed' });
  }
} 