import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Get top 20 quiz attempts with user information
      const leaderboard = await prisma.quizAttempt.findMany({
        take: 20,
        orderBy: {
          score: 'desc'
        },
        include: {
          user: {
            select: {
              username: true
            }
          }
        }
      });

      // Group by user and get their best score
      const userBestScores = new Map();
      leaderboard.forEach(attempt => {
        const username = attempt.user.username;
        if (!userBestScores.has(username) || userBestScores.get(username).score < attempt.score) {
          userBestScores.set(username, {
            username,
            score: attempt.score,
            completedAt: attempt.completedAt
          });
        }
      });

      // Convert to array and sort by score
      const sortedLeaderboard = Array.from(userBestScores.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);

      res.status(200).json(sortedLeaderboard);
    } catch (error) {
      console.error('Error fetching quiz leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch quiz leaderboard' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
