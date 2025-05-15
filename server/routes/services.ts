import { Router, Request, Response } from 'express';
import { storage } from '../storage';

const router = Router();

// Get all active service items
router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await storage.getActiveServiceItems();
    res.json(items);
  } catch (error) {
    console.error('Error fetching service items:', error);
    res.status(500).json({ error: 'Failed to fetch service items' });
  }
});

// Get service item by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = await storage.getServiceItemById(id);
    
    if (!item || !item.active) {
      return res.status(404).json({ error: 'Service item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching service item:', error);
    res.status(500).json({ error: 'Failed to fetch service item' });
  }
});

export default router;