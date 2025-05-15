import { storage } from './storage';

async function addTestimonials() {
  try {
    console.log('Adding testimonials...');
    
    // Create testimonials
    await storage.createTestimonialItem({
      quote: "Sarah made me feel so beautiful on my wedding day. Her artistry is incredible, and she knew exactly what would complement my features and dress.",
      name: "Elena Popescu",
      role: "Bridal Client",
      order: 1,
      active: true
    });

    await storage.createTestimonialItem({
      quote: "The makeup lesson I had with Sarah was eye-opening! She taught me techniques I now use every day, and I finally understand how to work with my eye shape.",
      name: "Maria Ionescu",
      role: "Makeup Lesson Client",
      order: 2,
      active: true
    });

    await storage.createTestimonialItem({
      quote: "As a photographer, I've worked with many makeup artists, but Sarah stands out for her attention to detail and ability to create camera-perfect looks every time.",
      name: "Andrei Dumitru",
      role: "Photographer",
      order: 3,
      active: true
    });
    
    console.log('Testimonials added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding testimonials:', error);
    process.exit(1);
  }
}

addTestimonials();