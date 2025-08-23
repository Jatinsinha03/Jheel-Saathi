import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { waterBodyId } = req.query;

      if (waterBodyId) {
        // Get questionnaires for a specific water body
        const questionnaires = await prisma.waterBodyQuestionnaire.findMany({
          where: {
            waterBodyId: waterBodyId as string
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        res.status(200).json(questionnaires);
      } else {
        // Get all questionnaires
        const questionnaires = await prisma.waterBodyQuestionnaire.findMany({
          include: {
            waterBody: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        res.status(200).json(questionnaires);
      }
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
      res.status(500).json({ error: 'Failed to fetch questionnaires' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        waterBodyId,
        waterClarityRating,
        fishPresence,
        birdPresence,
        otherWildlife,
        biodiversityNotes,
        vegetationDensity,
        vegetationTypes,
        generalNotes,
        userLatitude,
        userLongitude,
        userName
      } = req.body;

      if (!waterBodyId || waterClarityRating === undefined || vegetationDensity === undefined) {
        return res.status(400).json({ 
          error: 'Missing required fields: waterBodyId, waterClarityRating, vegetationDensity' 
        });
      }

      const questionnaire = await prisma.waterBodyQuestionnaire.create({
        data: {
          waterBodyId,
          waterClarityRating: parseInt(waterClarityRating),
          fishPresence: Boolean(fishPresence),
          birdPresence: Boolean(birdPresence),
          otherWildlife: Boolean(otherWildlife),
          biodiversityNotes,
          vegetationDensity: parseInt(vegetationDensity),
          vegetationTypes: Array.isArray(vegetationTypes) ? vegetationTypes : [],
          generalNotes,
          userLatitude: userLatitude ? parseFloat(userLatitude) : null,
          userLongitude: userLongitude ? parseFloat(userLongitude) : null,
          userName
        }
      });

      res.status(201).json(questionnaire);
    } catch (error) {
      console.error('Error creating questionnaire:', error);
      res.status(500).json({ error: 'Failed to create questionnaire' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
