import { Router, Request, Response } from 'express';
import { storage } from '../storage';

const router = Router();

// Get all active portfolio items
router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await storage.getActivePortfolioItems();
    res.json(items);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio items' });
  }
});

// Get portfolio items by category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const items = await storage.getPortfolioItemsByCategory(category);
    res.json(items);
  } catch (error) {
    console.error('Error fetching portfolio items by category:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio items by category' });
  }
});

// Get portfolio item by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = await storage.getPortfolioItemById(id);
    
    if (!item || !item.active) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio item' });
  }
});

export default router;