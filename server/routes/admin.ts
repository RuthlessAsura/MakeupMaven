import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { insertSiteContentSchema, insertPortfolioItemSchema, insertServiceItemSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// Simple admin authentication middleware
const checkAdmin = async (req: Request, res: Response, next: Function) => {
  // Using a fixed set of credentials for admin access
  // For now simple basic auth
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Extract credentials from Basic Auth header
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');
  
  // Fixed admin credentials
  if (username !== 'admin' || password !== 'sarah0808') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  next();
};

// Site content routes
router.get('/content/:section', checkAdmin, async (req: Request, res: Response) => {
  try {
    const { section } = req.params;
    const contents = await storage.getSiteContentBySection(section);
    res.json(contents);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

router.get('/content/:section/:key', checkAdmin, async (req: Request, res: Response) => {
  try {
    const { section, key } = req.params;
    const content = await storage.getSiteContentByKey(section, key);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

router.post('/content', checkAdmin, async (req: Request, res: Response) => {
  try {
    const validatedData = insertSiteContentSchema.parse(req.body);
    const content = await storage.createSiteContent(validatedData);
    res.status(201).json(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

router.put('/content/:id', checkAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { value } = req.body;
    
    if (typeof value !== 'string') {
      return res.status(400).json({ error: 'Value must be a string' });
    }
    
    const content = await storage.updateSiteContent(id, value);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Portfolio routes
router.get('/portfolio', checkAdmin, async (_req: Request, res: Response) => {
  try {
    const items = await storage.getAllPortfolioItems();
    res.json(items);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio items' });
  }
});

router.get('/portfolio/:id', checkAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = await storage.getPortfolioItemById(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio item' });
  }
});

router.post('/portfolio', checkAdmin, async (req: Request, res: Response) => {
  try {
    const validatedData = insertPortfolioItemSchema.parse(req.body);
    const item = await storage.createPortfolioItem(validatedData);
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating portfolio item:', error);
    res.status(500).json({ error: 'Failed to create portfolio item' });
  }
});

router.put('/portfolio/:id', checkAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = insertPortfolioItemSchema.partial().parse(req.body);
    const item = await storage.updatePortfolioItem(id, validatedData);
    
    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating portfolio item:', error);
    res.status(500).json({ error: 'Failed to update portfolio item' });
  }
});

router.delete('/portfolio/:id', checkAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deletePortfolioItem(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ error: 'Failed to delete portfolio item' });
  }
});

// Service routes
router.get('/services', checkAdmin, async (_req: Request, res: Response) => {
  try {
    const items = await storage.getAllServiceItems();
    res.json(items);
  } catch (error) {
    console.error('Error fetching service items:', error);
    res.status(500).json({ error: 'Failed to fetch service items' });
  }
});

router.get('/services/:id', checkAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = await storage.getServiceItemById(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Service item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching service item:', error);
    res.status(500).json({ error: 'Failed to fetch service item' });
  }
});

router.post('/services', checkAdmin, async (req: Request, res: Response) => {
  try {
    const validatedData = insertServiceItemSchema.parse(req.body);
    const item = await storage.createServiceItem(validatedData);
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating service item:', error);
    res.status(500).json({ error: 'Failed to create service item' });
  }
});

router.put('/services/:id', checkAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = insertServiceItemSchema.partial().parse(req.body);
    const item = await storage.updateServiceItem(id, validatedData);
    
    if (!item) {
      return res.status(404).json({ error: 'Service item not found' });
    }
    
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating service item:', error);
    res.status(500).json({ error: 'Failed to update service item' });
  }
});

router.delete('/services/:id', checkAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteServiceItem(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Service item not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service item:', error);
    res.status(500).json({ error: 'Failed to delete service item' });
  }
});

export default router;