import { storage } from './storage';

// Initialize website content
// Function to initialize testimonial items
async function initTestimonialItems() {
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

  // Testimonials section content
  await storage.createSiteContent({
    section: 'testimonials',
    key: 'title',
    value: 'Client Love'
  });

  await storage.createSiteContent({
    section: 'testimonials',
    key: 'subtitle',
    value: 'What clients are saying about their experience'
  });
}

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
    await initTestimonialItems();
    
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
    key: 'paragraph1',
    value: 'With over 8 years of experience in the beauty industry, I specialize in creating looks that enhance natural beauty while achieving the perfect style for any occasion.'
  });
  
  await storage.createSiteContent({
    section: 'about',
    key: 'paragraph2',
    value: 'My approach combines technical expertise with artistic vision, ensuring each client receives a personalized experience that makes them look and feel their absolute best.'
  });
  
  await storage.createSiteContent({
    section: 'about',
    key: 'paragraph3',
    value: 'I\'ve trained with leading makeup artists in New York and Paris, and my work has been featured in several fashion magazines and runway shows.'
  });
  
  await storage.createSiteContent({
    section: 'about',
    key: 'background_title',
    value: 'Professional Background'
  });
  
  await storage.createSiteContent({
    section: 'about',
    key: 'credential1',
    value: 'Certified Professional Makeup Artist'
  });
  
  await storage.createSiteContent({
    section: 'about',
    key: 'credential2',
    value: 'Fashion Week Experience (NYC, London)'
  });
  
  await storage.createSiteContent({
    section: 'about',
    key: 'credential3',
    value: 'Celebrity Client Portfolio'
  });
  
  await storage.createSiteContent({
    section: 'about',
    key: 'credential4',
    value: 'Advanced Color Theory Specialist'
  });
  
  await storage.createSiteContent({
    section: 'about',
    key: 'image_url',
    value: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
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
  
  await storage.createSiteContent({
    section: 'footer',
    key: 'brand_name',
    value: 'Sarah Condrea'
  });
  
  await storage.createSiteContent({
    section: 'footer',
    key: 'tagline',
    value: 'Makeup Artist & Beauty Specialist'
  });
  
  await storage.createSiteContent({
    section: 'footer',
    key: 'location',
    value: 'Barlad, Romania'
  });
  
  await storage.createSiteContent({
    section: 'footer',
    key: 'menu_portfolio',
    value: 'Portfolio'
  });
  
  await storage.createSiteContent({
    section: 'footer',
    key: 'menu_services',
    value: 'Services'
  });
  
  await storage.createSiteContent({
    section: 'footer',
    key: 'menu_about',
    value: 'About'
  });
  
  await storage.createSiteContent({
    section: 'footer',
    key: 'menu_contact',
    value: 'Contact'
  });
  
  await storage.createSiteContent({
    section: 'footer',
    key: 'instagram_url',
    value: 'https://instagram.com'
  });
  
  await storage.createSiteContent({
    section: 'footer',
    key: 'facebook_url',
    value: 'https://facebook.com'
  });
  
  await storage.createSiteContent({
    section: 'footer',
    key: 'pinterest_url',
    value: 'https://pinterest.com'
  });
  
  await storage.createSiteContent({
    section: 'footer',
    key: 'youtube_url',
    value: 'https://youtube.com'
  });
  
  // Navigation section
  await storage.createSiteContent({
    section: 'navigation',
    key: 'menu_home',
    value: 'Home'
  });
  
  await storage.createSiteContent({
    section: 'navigation',
    key: 'menu_portfolio',
    value: 'Portfolio'
  });
  
  await storage.createSiteContent({
    section: 'navigation',
    key: 'menu_services',
    value: 'Services'
  });
  
  await storage.createSiteContent({
    section: 'navigation',
    key: 'menu_about',
    value: 'About'
  });
  
  await storage.createSiteContent({
    section: 'navigation',
    key: 'menu_contact',
    value: 'Contact'
  });
  
  // Testimonials section
  await storage.createSiteContent({
    section: 'testimonials',
    key: 'title',
    value: 'Client Love'
  });
  
  await storage.createSiteContent({
    section: 'testimonials',
    key: 'subtitle',
    value: 'What my clients have to say about their experiences'
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