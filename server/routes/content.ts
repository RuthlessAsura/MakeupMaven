import { Router, Request, Response } from 'express';
import { storage } from '../storage';

const router = Router();

// Get content by section and key
router.get('/:section/:key', async (req: Request, res: Response) => {
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

// Get all content by section
router.get('/:section', async (req: Request, res: Response) => {
  try {
    const { section } = req.params;
    const contents = await storage.getSiteContentBySection(section);
    res.json(contents);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

export default router;