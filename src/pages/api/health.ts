import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Get basic stats
    const userCount = await prisma.user.count();
    const waterBodyCount = await prisma.waterBody.count();
    const questionnaireCount = await prisma.waterBodyQuestionnaire.count();
    const quizQuestionCount = await prisma.quizQuestion.count();
    const quizAttemptCount = await prisma.quizAttempt.count();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      stats: {
        users: userCount,
        waterBodies: waterBodyCount,
        questionnaires: questionnaireCount,
        quizQuestions: quizQuestionCount,
        quizAttempts: quizAttemptCount
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
