import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const waterBodies = await prisma.waterBody.findMany({
        include: {
          questionnaires: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1 // Get the most recent questionnaire for each water body
          }
        }
      });

      res.status(200).json(waterBodies);
    } catch (error) {
      console.error('Error fetching water bodies:', error);
      res.status(500).json({ error: 'Failed to fetch water bodies' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, latitude, longitude, description } = req.body;

      if (!name || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'Missing required fields: name, latitude, longitude' });
      }

      const waterBody = await prisma.waterBody.create({
        data: {
          name,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          description
        }
      });

      res.status(201).json(waterBody);
    } catch (error) {
      console.error('Error creating water body:', error);
      res.status(500).json({ error: 'Failed to create water body' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
