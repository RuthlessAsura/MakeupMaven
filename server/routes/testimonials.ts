import { Router, Request, Response } from 'express';
import { storage } from '../storage';

const router = Router();

// Get all active testimonials
router.get('/', async (_req: Request, res: Response) => {
  try {
    const testimonials = await storage.getActiveTestimonialItems();
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Get a testimonial by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid testimonial ID' });
    }
    
    const testimonial = await storage.getTestimonialItemById(id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    res.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
});

export default router;