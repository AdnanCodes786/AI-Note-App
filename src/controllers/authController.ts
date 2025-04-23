import { Request, Response } from 'express';
import { supabase } from '../utils/supaBaseClient';

// User signup -> api for user signup
export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name, phoneNumber } = req.body;
  
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }
  
      // Create user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phoneNumber
          }
        }
      });
  
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
  
      res.status(201).json({
        message: 'User created successfully',
        user: data.user
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

// API To Login an user
// api which would be used for login of an User
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
  
      if (error) {
        
        if (error.message.includes('Email not confirmed')) {
          res.status(401).json({ 
            error: 'Please confirm your email before logging in',
            needsEmailConfirmation: true
          });
          return;
        }
        
        res.status(401).json({ error: error.message });
        return;
      }
  
      // Extract token from session
      const token = data.session?.access_token;
      const refreshToken = data.session?.refresh_token;
  
      res.status(200).json({
        message: 'Login successful',
        user: data.user,
        token,
        refreshToken
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

// Google OAuth sign in
export const googleSignIn = async (req: Request, res: Response) => {
  try {
    // This route should be used to get the Google OAuth URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.FRONTEND_URL}/auth/callback`
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ url: data.url });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get current user
//api to fetch the current Details of the user
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user; 

    if (!user || !user.id) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
    }
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      res.status(400).json({ error: error.message });
    }

     res.status(200).json({ message: 'Logout successful' });
  } catch (error: any) {
     res.status(500).json({ error: error.message });
  }
};