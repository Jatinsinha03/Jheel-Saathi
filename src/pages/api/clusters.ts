import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import Supercluster from 'supercluster';

type GeoJSONFeature = {
  type: 'Feature';
  properties: {
    id: string;
    name: string;
    description: string | null;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

// Singleton supercluster instance
let index: Supercluster | null = null;

async function initializeSupercluster(): Promise<Supercluster | null> {
  if (index) return index;

  try {
    // Fetch water bodies from database
    const waterBodies = await prisma.waterBody.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        latitude: true,
        longitude: true,
      }
    });

    const points: GeoJSONFeature[] = waterBodies.map(waterBody => ({
      type: 'Feature',
      properties: {
        id: waterBody.id,
        name: waterBody.name,
        description: waterBody.description
      },
      geometry: {
        type: 'Point',
        coordinates: [waterBody.longitude, waterBody.latitude] // [lng, lat]
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bbox, zoom, expand } = req.query;

  if (!zoom) {
    return res.status(400).json({ error: 'Missing zoom parameter' });
  }

  const supercluster = await initializeSupercluster();
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
