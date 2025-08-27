import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../lib/prisma';

export function withPrisma(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Ensure connection is active
      await prisma.$connect();
      
      // Call the handler
      return await handler(req, res);
    } catch (error) {
      console.error('Prisma middleware error:', error);
      
      // Check if it's a connection error
      if (error instanceof Error && 
          (error.message.includes('prepared statement') || 
           error.message.includes('connection') ||
           error.message.includes('timeout'))) {
        
        try {
          // Try to reconnect
          await prisma.$disconnect();
          await prisma.$connect();
          
          // Retry the handler once
          return await handler(req, res);
        } catch (reconnectError) {
          console.error('Reconnection failed:', reconnectError);
          return res.status(500).json({ 
            error: 'Database connection failed. Please try again later.',
            details: 'Connection retry failed'
          });
        }
      }
      
      // Re-throw other errors
      throw error;
    } finally {
      // Don't disconnect here as other requests might need the connection
      // The connection will be managed by the global Prisma client
    }
  };
}
