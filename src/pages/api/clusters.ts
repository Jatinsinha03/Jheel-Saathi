import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import Supercluster from 'supercluster';

interface Company {
  name: string;
  logoUrl: string;
  coordinates: [number, number]; // [lng, lat]
}

type GeoJSONFeature = {
  type: 'Feature';
  properties: {
    name: string;
    logoUrl: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

// Singleton supercluster instance
let index: Supercluster | null = null;

function initializeSupercluster(): Supercluster | null {
  if (index) return index;

  try {
    const dataPath = path.join(process.cwd(), 'public', 'final_merged_companies.json');
    const raw: Company[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    const points: GeoJSONFeature[] = raw.map(company => ({
      type: 'Feature',
      properties: {
        name: company.name,
        logoUrl: company.logoUrl
      },
      geometry: {
        type: 'Point',
        coordinates: company.coordinates
      }
    }));

    index = new Supercluster({
      radius: 25,
      maxZoom: 20
    });

    index.load(points);
    return index;
  } catch (err) {
    console.error('Failed to initialize supercluster:', err);
    return null;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bbox, zoom, expand } = req.query;

  if (!zoom) {
    return res.status(400).json({ error: 'Missing zoom parameter' });
  }

  const supercluster = initializeSupercluster();
  if (!supercluster) {
    return res.status(500).json({ error: 'Failed to initialize clustering engine' });
  }

  try {
    // Handle cluster expansion
    if (expand) {
      const clusterId = parseInt(expand as string, 10);
      const leaves = supercluster.getLeaves(clusterId, Infinity);
      
      res.status(200).json({
        type: 'FeatureCollection',
        features: leaves
      });
      return;
    }

    // Handle normal clustering
    if (!bbox) {
      return res.status(400).json({ error: 'Missing bbox parameter' });
    }

    const [west, south, east, north] = (bbox as string).split(',').map(Number);
    const z = parseInt(zoom as string, 10);

    const clusters = supercluster.getClusters([west, south, east, north], z);

    res.status(200).json({
      type: 'FeatureCollection',
      features: clusters
    });
  } catch (err) {
    console.error('Cluster generation failed:', err);
    res.status(500).json({ error: 'Failed to compute clusters' });
  }
}
