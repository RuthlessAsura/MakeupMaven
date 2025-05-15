import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'sarah-condrea-makeup-artist-secret';

const router = Router();

// Validate login data
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    
    // Find user
    const user = await storage.getUserByUsername(validatedData.username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(validatedData.password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(403).json({ error: 'You do not have admin privileges' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return token
    res.json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Check authentication route
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number, username: string, isAdmin: boolean };
      
      // Get updated user info
      const user = await storage.getUser(decoded.id);
      
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      res.json({ user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Authentication check error:', error);
    res.status(500).json({ error: 'An error occurred during authentication check' });
  }
});

// Create initial admin user
router.post('/setup', async (req: Request, res: Response) => {
  try {
    // Check if admin already exists
    const existingAdmins = await storage.getAdminUsers();
    
    if (existingAdmins.length > 0) {
      return res.status(403).json({ error: 'Admin user already exists' });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await storage.createUser({
      username: 'admin',
      password: hashedPassword,
      isAdmin: true
    });

    res.status(201).json({ 
      message: 'Admin user created successfully',
      user: { id: adminUser.id, username: adminUser.username }
    });
  } catch (error) {
    console.error('Admin setup error:', error);
    res.status(500).json({ error: 'An error occurred during admin setup' });
  }
});

export default router;