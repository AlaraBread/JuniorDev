import { Request, Response, NextFunction } from 'express';
import { authStore } from '../db/auth';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
      }
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const user = authStore.validateSession(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Attach user info to request object (excluding password)
  req.user = {
    id: user.id,
    username: user.username
  };

  next();
}; 