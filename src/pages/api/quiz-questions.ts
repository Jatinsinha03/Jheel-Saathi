import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Get all questions and then randomly select 10
      const allQuestions = await prisma.quizQuestion.findMany();
      
      // Shuffle the questions to get random selection
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      const questions = shuffled.slice(0, 10);

      res.status(200).json(questions);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      res.status(500).json({ error: 'Failed to fetch quiz questions' });
    }
  } else if (req.method === 'POST') {
    try {
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
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      res.status(500).json({ error: 'Failed to submit quiz attempt' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
