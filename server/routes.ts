import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Import route handlers
import adminRoutes from './routes/admin';
import contentRoutes from './routes/content';
import portfolioRoutes from './routes/portfolio';
import servicesRoutes from './routes/services';
import testimonialsRoutes from './routes/testimonials';
import adminTestimonialsRoutes from './routes/admin-testimonials';
import authRoutes from './routes/auth-simple';
import { initializeWebsiteData } from './initData';

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize website data
  await initializeWebsiteData();
  
  // Register API routes
  app.use('/api/admin', adminRoutes);
  app.use('/api/admin/testimonials', adminTestimonialsRoutes);
  app.use('/api/content', contentRoutes);
  app.use('/api/portfolio', portfolioRoutes);
  app.use('/api/services', servicesRoutes);
  app.use('/api/testimonials', testimonialsRoutes);
  app.use('/api/auth', authRoutes);
  
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contactSubmission = await storage.createContactSubmission(validatedData);
      res.status(201).json({ success: true, data: contactSubmission });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, error: validationError.message });
      } else {
        console.error("Error submitting contact form:", error);
        res.status(500).json({ 
          success: false, 
          error: "An error occurred while submitting your message. Please try again." 
        });
      }
    }
  });

  // Get all contact submissions
  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.status(200).json({ success: true, data: submissions });
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ 
        success: false, 
        error: "An error occurred while fetching contact submissions." 
      });
    }
  });

  // Generate a random API key for admin access if none exists
  if (!process.env.ADMIN_API_KEY) {
    const apiKey = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
    process.env.ADMIN_API_KEY = apiKey;
    console.log(`Admin API Key generated: ${apiKey}`);
    console.log('Use this key as X-API-Key header for admin API access');
  }

  const httpServer = createServer(app);

  return httpServer;
}
