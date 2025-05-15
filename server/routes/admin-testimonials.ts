import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { checkAdmin } from './auth-simple';
import { insertTestimonialItemSchema } from '@shared/schema';

const router = Router();

// Get all testimonials (admin)
router.get('/', checkAdmin, async (_req: Request, res: Response) => {
  try {
    const testimonials = await storage.getAllTestimonialItems();
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Get a testimonial by ID (admin)
router.get('/:id', checkAdmin, async (req: Request, res: Response) => {
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

// Create a new testimonial (admin)
router.post('/', checkAdmin, async (req: Request, res: Response) => {
  try {
    const testimonialData = insertTestimonialItemSchema.parse(req.body);
    const testimonial = await storage.createTestimonialItem(testimonialData);
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(400).json({ error: 'Failed to create testimonial' });
  }
});

// Update a testimonial (admin)
router.put('/:id', checkAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid testimonial ID' });
    }
    
    const testimonialData = insertTestimonialItemSchema.partial().parse(req.body);
    const updatedTestimonial = await storage.updateTestimonialItem(id, testimonialData);
    
    if (!updatedTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    res.json(updatedTestimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(400).json({ error: 'Failed to update testimonial' });
  }
});

// Delete a testimonial (admin)
router.delete('/:id', checkAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid testimonial ID' });
    }
    
    const deleted = await storage.deleteTestimonialItem(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

export default router;