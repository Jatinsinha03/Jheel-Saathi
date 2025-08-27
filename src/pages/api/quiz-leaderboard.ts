import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
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
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in quiz-leaderboard API:', error);
    
    // Check if it's a Prisma connection error
    if (error instanceof Error && error.message.includes('prepared statement')) {
      // Try to reconnect
      try {
        await prisma.$disconnect();
        await prisma.$connect();
        res.status(500).json({ error: 'Database connection issue. Please try again.' });
      } catch (reconnectError) {
        res.status(500).json({ error: 'Database connection failed. Please try again later.' });
      }
    } else {
      res.status(500).json({ error: 'Failed to fetch quiz leaderboard' });
    }
  }
}
