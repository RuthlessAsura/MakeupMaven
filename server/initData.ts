import { storage } from './storage';

// Initialize website content
export async function initializeWebsiteData() {
  try {
    console.log('Checking for existing content...');
    
    // Check if content already exists
    const heroContent = await storage.getSiteContentBySection('hero');
    if (heroContent.length > 0) {
      console.log('Content already exists, skipping initialization');
      return;
    }
    
    console.log('No content found. Initializing website data...');
    
    // Initialize site content for different sections
    await initSiteContent();
    await initPortfolioItems();
    await initServiceItems();
    
    console.log('Website data initialization complete!');
  } catch (error) {
    console.error('Error initializing website data:', error);
  }
}

async function initSiteContent() {
  // Hero section
  await storage.createSiteContent({
    section: 'hero',
    key: 'title',
    value: '<span class="text-accent">Transforming</span> Beauty Into Art'
  });
  
  await storage.createSiteContent({
    section: 'hero',
    key: 'subtitle',
    value: 'Professional makeup artistry for weddings, editorial shoots, special events, and more. Let\'s create a look that\'s uniquely you.'
  });
  
  // About section
  await storage.createSiteContent({
    section: 'about',
    key: 'title',
    value: 'About Sarah'
  });
  
  await storage.createSiteContent({
    section: 'about',
    key: 'bio',
    value: 'Sarah Condrea is a professional makeup artist based in Barlad, Romania. With over 5 years of experience, she specializes in bridal, editorial, and special event makeup. Her attention to detail and ability to enhance each client\'s natural beauty has earned her a loyal following and industry recognition.'
  });
  
  await storage.createSiteContent({
    section: 'about',
    key: 'mission',
    value: 'My mission is to help every client feel confident and beautiful. I believe makeup should enhance your natural features while reflecting your personal style. Whether it\'s your wedding day, a photoshoot, or a special event, I\'m dedicated to creating a look that makes you feel like the best version of yourself.'
  });
  
  // Services section
  await storage.createSiteContent({
    section: 'services',
    key: 'title',
    value: 'Services'
  });
  
  await storage.createSiteContent({
    section: 'services',
    key: 'subtitle',
    value: 'Professional makeup services tailored to your unique style and occasion'
  });
  
  // Portfolio section
  await storage.createSiteContent({
    section: 'portfolio',
    key: 'title',
    value: 'Portfolio'
  });
  
  await storage.createSiteContent({
    section: 'portfolio',
    key: 'subtitle',
    value: 'Explore my latest work and creative makeup designs'
  });
  
  // Contact section
  await storage.createSiteContent({
    section: 'contact',
    key: 'title',
    value: 'Get In Touch'
  });
  
  await storage.createSiteContent({
    section: 'contact',
    key: 'subtitle',
    value: 'Have a question or ready to book a session? Contact me today!'
  });
  
  await storage.createSiteContent({
    section: 'contact',
    key: 'address',
    value: 'Barlad, Romania'
  });
  
  await storage.createSiteContent({
    section: 'contact',
    key: 'email',
    value: 'sarah@example.com'
  });
  
  await storage.createSiteContent({
    section: 'contact',
    key: 'phone',
    value: '+40 123 456 789'
  });
  
  // Footer section
  await storage.createSiteContent({
    section: 'footer',
    key: 'copyright',
    value: '© 2025 Sarah Condrea. All rights reserved.'
  });
}

async function initPortfolioItems() {
  // Create sample portfolio items
  await storage.createPortfolioItem({
    title: "Classic Bridal",
    description: "Timeless elegance for the special day",
    imageUrl: "https://pixabay.com/get/g7a73d102601dc64e37add37688574def1364cc2e401f5a52db7a5d90ddc6a5f650586bd106977eb9831faec1a23c3a07e2436a8fb7617e73d4c9d819e2804628_1280.jpg",
    category: "bridal",
    order: 1,
    active: true
  });
  
  await storage.createPortfolioItem({
    title: "Avant-Garde Editorial",
    description: "Pushing boundaries with artistic expression",
    imageUrl: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "editorial",
    order: 2,
    active: true
  });
  
  await storage.createPortfolioItem({
    title: "Natural Glam",
    description: "Enhancing natural beauty for everyday elegance",
    imageUrl: "https://images.unsplash.com/photo-1503236823255-94609f598e71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "everyday",
    order: 3,
    active: true
  });
}

async function initServiceItems() {
  // Create sample service items
  await storage.createServiceItem({
    title: "Bridal Makeup",
    description: "Flawless, long-lasting makeup for your special day. Includes consultation and trial.",
    imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: "From $250",
    order: 1,
    active: true
  });
  
  await storage.createServiceItem({
    title: "Special Events",
    description: "Glamorous looks for galas, parties, proms, and other special occasions.",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: "From $120",
    order: 2,
    active: true
  });
  
  await storage.createServiceItem({
    title: "Photo/Video",
    description: "Camera-ready makeup for photoshoots, videos, and production work.",
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: "From $175",
    order: 3,
    active: true
  });
  
  await storage.createServiceItem({
    title: "Makeup Lessons",
    description: "One-on-one or group lessons to master everyday techniques.",
    imageUrl: "https://pixabay.com/get/g7c90972314b19f7413c56961fbb096494084367d3f0b073b31d0946275777585c121d50bd9f711d0ed7e098f9105ba83c127feebef996fb53ca375d418652a18_1280.jpg",
    price: "From $150",
    order: 4,
    active: true
  });
}