import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supaBaseClient';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
      };
    }
  }
}

export const authenticateUser = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    
    // Add the user to the request object
    req.user = {
      id: data.user.id,
      email: data.user.email as string,
      name: data.user.user_metadata?.name as string
    };
    
    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
    return;
  }
};