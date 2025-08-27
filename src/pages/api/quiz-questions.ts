import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Get all questions and then randomly select 10
      const allQuestions = await prisma.quizQuestion.findMany();
      
      // Shuffle the questions to get random selection
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      const questions = shuffled.slice(0, 10);

      res.status(200).json(questions);
    } else if (req.method === 'POST') {
      const { userId, score, answers } = req.body;

      if (!userId || score === undefined || !answers) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const quizAttempt = await prisma.quizAttempt.create({
        data: {
          userId,
          score,
          totalQuestions: 10,
          answers
        }
      });

      res.status(201).json(quizAttempt);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in quiz-questions API:', error);
    
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
      res.status(500).json({ error: 'Failed to process request' });
    }
  }
}
