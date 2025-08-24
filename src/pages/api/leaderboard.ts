import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get users with their questionnaire counts, ordered by count descending
    const leaderboardData = await prisma.user.findMany({
      select: {
        username: true,
        _count: {
          select: {
            questionnaires: true
          }
        }
      },
      where: {
        questionnaires: {
          some: {} // Only include users who have completed at least one questionnaire
        }
      },
      orderBy: {
        questionnaires: {
          _count: 'desc'
        }
      }
    });

    // Transform data and add ranks
    const leaderboard = leaderboardData.map((entry, index) => ({
      username: entry.username,
      questionnaireCount: entry._count.questionnaires,
      rank: index + 1
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

