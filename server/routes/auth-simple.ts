import { Router, Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const router = Router();

// Fix admin credentials - hardcoded for now, we'll add setup later
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // This would be hashed in a real setup

// Simple authentication middleware using Basic Auth
export const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // Get auth header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Decode credentials
  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    // Check against fixed admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return next();
    }
    
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid authentication format' });
  }
};

// Validate login data
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

// Login route (for JWT style auth if needed later)
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    
    // Check against fixed admin credentials
    if (validatedData.username === ADMIN_USERNAME && validatedData.password === ADMIN_PASSWORD) {
      // Return success with user info
      return res.json({ 
        user: { 
          username: ADMIN_USERNAME, 
          isAdmin: true 
        } 
      });
    }
    
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get current user info
router.get('/me', checkAdmin, async (req: Request, res: Response) => {
  res.json({ 
    user: { 
      username: ADMIN_USERNAME, 
      isAdmin: true 
    } 
  });
});

export default router;