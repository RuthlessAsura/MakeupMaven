import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { 
  Check, 
  MapPin, 
  Mail, 
  Instagram,
  Quote
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { contactFormSchema } from "@/lib/types";

type GalleryItem = {
  id: number;
  image: string;
  title: string;
  description: string;
  category: "bridal" | "editorial" | "everyday";
};

type ServiceItem = {
  id: number;
  image: string;
  title: string;
  description: string;
  price: string;
};

type TestimonialItem = {
  id: number;
  quote: string;
  name: string;
  role: string;
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<"all" | "bridal" | "editorial" | "everyday">("all");
  const { toast } = useToast();
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Parallax effect for 3D makeup icons
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const elements = parallaxRef.current.querySelectorAll('.parallax-layer');
        const scrollPosition = window.scrollY;
        
        elements.forEach((element) => {
          const depth = parseFloat(element.getAttribute('data-depth') || '0.1');
          const movement = scrollPosition * depth;
          const el = element as HTMLElement;
          el.style.transform = `translate3d(0, ${movement}px, 0)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Form handling
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      service: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: z.infer<typeof contactFormSchema>) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof contactFormSchema>) => {
    contactMutation.mutate(data);
  };

  // Gallery data
  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      image: "https://pixabay.com/get/g7a73d102601dc64e37add37688574def1364cc2e401f5a52db7a5d90ddc6a5f650586bd106977eb9831faec1a23c3a07e2436a8fb7617e73d4c9d819e2804628_1280.jpg",
      title: "Classic Bridal",
      description: "Timeless elegance for the special day",
      category: "bridal"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Avant-Garde Editorial",
      description: "Pushing boundaries with artistic expression",
      category: "editorial"
    },
    {
      id: 3,
      image: "https://pixabay.com/get/g09c683954a8c6ad54a8decb1adb6110693d43e6cc7d7ea1c484e08aaba22d784e9065ff7ae3b46cdd1ac8820ba2934c0dc516fe7ba0b6611169a93bb6d630363_1280.jpg",
      title: "Natural Glow",
      description: "Enhancing beauty for everyday confidence",
      category: "everyday"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Evening Drama",
      description: "Bold looks for special nights",
      category: "editorial"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1560363199-a1264d4ea5fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Modern Bride",
      description: "Contemporary styles for the modern bride",
      category: "bridal"
    },
    {
      id: 6,
      image: "https://pixabay.com/get/g00975d9a8bc3ba36530979ad7219443f19cddaab966eb7a37cbcd7c6fdcbacd8d670bbdbd5f23d23c0c4478334c117da8f1326c295040e3e7409d92fb9e0aafe_1280.jpg",
      title: "Minimalist Beauty",
      description: "Less is more with subtle enhancement",
      category: "everyday"
    }
  ];

  // Services data
  const serviceItems: ServiceItem[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Bridal Makeup",
      description: "Complete bridal packages including trials, day-of services, and touch-ups.",
      price: "From $250"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Special Events",
      description: "Glamorous looks for galas, parties, proms, and other special occasions.",
      price: "From $120"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Photo/Video",
      description: "Camera-ready makeup for photoshoots, videos, and production work.",
      price: "From $175"
    },
    {
      id: 4,
      image: "https://pixabay.com/get/g7c90972314b19f7413c56961fbb096494084367d3f0b073b31d0946275777585c121d50bd9f711d0ed7e098f9105ba83c127feebef996fb53ca375d418652a18_1280.jpg",
      title: "Makeup Lessons",
      description: "One-on-one or group lessons to master everyday techniques.",
      price: "From $150"
    }
  ];

  // Testimonials data
  const testimonials: TestimonialItem[] = [
    {
      id: 1,
      quote: "Elena made me feel so beautiful on my wedding day. Her artistry is incredible, and she knew exactly what would complement my features and dress.",
      name: "Sarah Johnson",
      role: "Bridal Client"
    },
    {
      id: 2,
      quote: "The makeup lesson I had with Elena was eye-opening! She taught me techniques I now use every day, and I finally understand how to work with my eye shape.",
      name: "Michelle Lee",
      role: "Makeup Lesson Client"
    },
    {
      id: 3,
      quote: "As a photographer, I've worked with many makeup artists, but Elena stands out for her attention to detail and ability to create camera-perfect looks every time.",
      name: "James Wilson",
      role: "Photographer"
    }
  ];

  // Filter gallery items based on active filter
  const filteredGalleryItems = activeFilter === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <>
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-pink-50 dark:bg-gray-900">
          <div className="absolute inset-0 z-0 opacity-15 dark:opacity-30 pointer-events-none" id="parallax-container" ref={parallaxRef}>
            <div className="parallax-layer" data-depth="0.2">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MDAgNjAwIiB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCI+PCEtLSBNYWtldXAgQnJ1c2ggLS0+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAwLCAyMDApIHJvdGF0ZSgtMzApIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjI1IiByeD0iNSIgZmlsbD0iI2Y4YzNkOCIgLz48cmVjdCB4PSIxNTAiIHk9IjAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMjUiIHJ4PSI1IiBmaWxsPSIjZDRhZmM5IiAvPjxwYXRoIGQ9Ik0yNzAsMTIuNSBMMjkwLDIwIEwyNzAsMjUgWiIgZmlsbD0iI2Q0YWZjOSIgLz48cmVjdCB4PSI1MCIgeT0iNy41IiB3aWR0aD0iNjUiIGhlaWdodD0iMTAiIHJ4PSI1IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjMiIC8+PC9nPjwhLS0gTGlwc3RpY2sgLS0+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDUwLCAxNTApIHJvdGF0ZSgxNSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyNSIgaGVpZ2h0PSI4MCIgcng9IjEyLjUiIGZpbGw9IiNkNjhhYjUiIC8+PHBhdGggZD0iTTAsMCBRMTIuNSwtMTUgMjUsMCBaIiBmaWxsPSIjZjI2YjljIiAvPjxyZWN0IHg9IjUiIHk9IjgwIiB3aWR0aD0iMTUiIGhlaWdodD0iNDAiIHJ4PSI3LjUiIGZpbGw9IiM5YzY5ODAiIC8+PC9nPjwhLS0gUG93ZGVyIENvbXBhY3QgLS0+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzUwLCAzNTApIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2Y4ZDBlMCIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2ZhZTNlZSIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2ZiZWNmMyIgLz48cGF0aCBkPSJNNTAsMTUgUTY1LDQwIDUwLDY1IFEzNSw0MCA1MCwxNSBaIiBmaWxsPSIjZjRiOGQxIiBvcGFjaXR5PSIwLjciIC8+PHJlY3QgeD0iMjUiIHk9IjUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI3IiByeD0iMyIgZmlsbD0iI2Q0YWZjOSIgLz48L2c+PCEtLSBFeWVsaW5lciAtLT48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAsIDQwMCkgcm90YXRlKC0yMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMzAiIGhlaWdodD0iMTUiIHJ4PSI3LjUiIGZpbGw9IiMzMzMzMzMiIC8+PHJlY3QgeD0iMTMwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMTUiIHJ4PSI3LjUiIGZpbGw9IiMxMTExMTEiIC8+PHJlY3QgeD0iMTAiIHk9IjQiIHdpZHRoPSIxMTAiIGhlaWdodD0iNyIgcng9IjMuNSIgZmlsbD0iIzU1NTU1NSIgLz48L2c+PCEtLSBNYXNjYXJhIC0tPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1MCwgMzIwKSByb3RhdGUoMTApIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiMyMjIyMjIiIC8+PHJlY3QgeD0iNSIgeT0iMTAwIiB3aWR0aD0iMTAiIGhlaWdodD0iMzAiIHJ4PSI1IiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHg9IjciIHk9IjEwIiB3aWR0aD0iNiIgaGVpZ2h0PSI4MCIgcng9IjMiIGZpbGw9IiM0NDQ0NDQiIC8+PC9nPjwhLS0gTmFpbCBQb2xpc2ggLS0+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAwLCAxMDApIHJvdGF0ZSgtNSkiPjxyZWN0IHg9IjAiIHk9IjMwIiB3aWR0aD0iNDAiIGhlaWdodD0iNjAiIHJ4PSI1IiBmaWxsPSIjZmY5ZWJjIiAvPjxyZWN0IHg9IjUiIHk9IjM1IiB3aWR0aD0iMzAiIGhlaWdodD0iNTAiIHJ4PSIzIiBmaWxsPSIjZjA2YjljIiAvPjxyZWN0IHg9IjEwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMzAiIHJ4PSIzIiBmaWxsPSIjMzMzMzMzIiAvPjxyZWN0IHg9IjE1IiB5PSIwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHJ4PSI1IiBmaWxsPSIjNTU1NTU1IiAvPjwvZz48IS0tIFNtYWxsIGRlY29yYXRpdmUgZWxlbWVudHMgLS0+PGNpcmNsZSBjeD0iOTAiIGN5PSIxMjAiIHI9IjgiIGZpbGw9IiNmOGMzZDgiIG9wYWNpdHk9IjAuOCIgLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSI5MCIgcj0iNSIgZmlsbD0iI2Q0YWZjOSIgb3BhY2l0eT0iMC44IiAvPjxjaXJjbGUgY3g9IjUwMCIgY3k9IjkwIiByPSI3IiBmaWxsPSIjZjhjM2Q4IiBvcGFjaXR5PSIwLjgiIC8+PGNpcmNsZSBjeD0iNTIwIiBjeT0iNDUwIiByPSI2IiBmaWxsPSIjZDRhZmM5IiBvcGFjaXR5PSIwLjgiIC8+PGNpcmNsZSBjeD0iNzAiIGN5PSI1MDAiIHI9IjkiIGZpbGw9IiNmOGMzZDgiIG9wYWNpdHk9IjAuOCIgLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI1MjAiIHI9IjciIGZpbGw9IiNkNGFmYzkiIG9wYWNpdHk9IjAuOCIgLz48IS0tIFNtYWxsIHN0YXJzIC0tPjxwYXRoIGQ9Ik0zNzAsMTAwIEwzNzMsMTA3IEwzODAsMTA4IEwzNzUsMTEzIEwzNzYsMTIwIEwzNzAsMTE3IEwzNjQsMTIwIEwzNjUsMTEzIEwzNjAsMTA4IEwzNjcsMTA3IFoiIGZpbGw9IiNmOGMzZDgiIG9wYWNpdHk9IjAuNiIgLz48cGF0aCBkPSJNMjcwLDQ4MCBMMjcyLDQ4NSBMMjc4LDQ4NiBMMjc0LDQ5MCBMMjc1LDQ5NiBMMjcwLDQ5MyBMMjY1LDQ5NiBMMjY2LDQ5MCBMMjYyLDQ4NiBMMjY4LDQ4NSBaIiBmaWxsPSIjZjhjM2Q4IiBvcGFjaXR5PSIwLjYiIC8+PHBhdGggZD0iTTUzMCwyNTAgTDUzMiwyNTUgTDUzOCwyNTYgTDUzNCwyNjAgTDUzNSwyNjYgTDUzMCwyNjMgTDUyNSwyNjYgTDUyNiwyNjAgTDUyMiwyNTYgTDUyOCwyNTUgWiIgZmlsbD0iI2Y4YzNkOCIgb3BhY2l0eT0iMC42IiAvPjwvc3ZnPg=="
                alt="Makeup elements background" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="max-w-2xl lg:w-1/2">
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-6xl font-light text-gray-900 dark:text-white mb-6 uppercase tracking-wide"
                >
                  <span className="text-accent">Transforming</span><br />Beauty Into Art
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-base md:text-lg font-light text-gray-700 dark:text-gray-300 mb-8"
                >
                  Professional makeup artistry for weddings, editorial shoots, special events, and more. Let's create a look that's uniquely you.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button 
                    asChild
                    className="px-6 py-3 bg-accent hover:bg-opacity-90 text-white text-center uppercase tracking-wider transition-all duration-300"
                  >
                    <a href="#portfolio">View My Work</a>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    className="px-6 py-3 border border-accent text-accent dark:text-white dark:border-white hover:bg-accent hover:text-white dark:hover:bg-white dark:hover:text-gray-900 text-center uppercase tracking-wider transition-all duration-300"
                  >
                    <a href="#contact">Book Session</a>
                  </Button>
                </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center"
              >
                <div className="relative w-full max-w-md h-96">
                  <div className="absolute inset-0 bg-pink-50 dark:bg-gray-800 flex items-center justify-center">
                    <div className="p-10 border border-pink-300 bg-white dark:bg-gray-700 shadow-lg flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 rounded-full bg-accent mb-6 flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.94 11a8.26 8.26 0 0 0-1.24-3.95 8.26 8.26 0 0 0-2.82-2.95 10.54 10.54 0 0 0-.87 3.99c0 1.3.39 2.55 1.3 3.57L12 18l-5.3-6.35a5.82 5.82 0 0 1 1.28-3.57c.29-.29.48-.67.55-1.08.31-1.96.76-3.2.76-3.2 1 2.81 2.64 5.15 4.32 7.34 1.41-1.78 2.84-3.75 3.86-5.85"/></svg>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-800 dark:text-white">Book Now</p>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">Available for special events, weddings and editorials</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Portfolio Gallery */}
        <section id="portfolio" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-normal mb-4 text-gray-900 dark:text-white scroll-reveal">Portfolio</h2>
              <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 scroll-reveal">Discover the artistry and transformations from my professional makeup journey.</p>
            </div>

            <div className="mb-10 flex justify-center scroll-reveal">
              <div className="inline-flex bg-white dark:bg-gray-800 p-1 shadow-md">
                <Button
                  variant={activeFilter === "all" ? "default" : "ghost"}
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 ${
                    activeFilter === "all" 
                      ? "bg-accent text-white" 
                      : "text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-primary"
                  }`}
                >
                  All
                </Button>
                <Button
                  variant={activeFilter === "bridal" ? "default" : "ghost"}
                  onClick={() => setActiveFilter("bridal")}
                  className={`px-4 py-2 ${
                    activeFilter === "bridal" 
                      ? "bg-accent text-white" 
                      : "text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-primary"
                  }`}
                >
                  Bridal
                </Button>
                <Button
                  variant={activeFilter === "editorial" ? "default" : "ghost"}
                  onClick={() => setActiveFilter("editorial")}
                  className={`px-4 py-2 ${
                    activeFilter === "editorial" 
                      ? "bg-accent text-white" 
                      : "text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-primary"
                  }`}
                >
                  Editorial
                </Button>
                <Button
                  variant={activeFilter === "everyday" ? "default" : "ghost"}
                  onClick={() => setActiveFilter("everyday")}
                  className={`px-4 py-2 ${
                    activeFilter === "everyday" 
                      ? "bg-accent text-white" 
                      : "text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-primary"
                  }`}
                >
                  Everyday
                </Button>
              </div>
            </div>

            {/* Featured Carousel */}
            <div className="mb-16">
              <Carousel 
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {galleryItems.map((item) => (
                    <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <div className="gallery-item overflow-hidden shadow-lg rounded-xl">
                          <img src={item.image} alt={item.title} className="w-full h-80 object-cover" />
                          <div className="p-4 bg-white dark:bg-gray-800">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-4">
                  <CarouselPrevious className="static translate-y-0 rounded-full" />
                  <CarouselNext className="static translate-y-0 rounded-full ml-4" />
                </div>
              </Carousel>
            </div>
            
            {/* Full Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredGalleryItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    layout
                    className="gallery-item overflow-hidden shadow-lg rounded-xl"
                  >
                    <img src={item.image} alt={item.title} className="w-full h-80 object-cover" />
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-normal mb-4 text-gray-900 dark:text-white scroll-reveal">Services</h2>
              <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 scroll-reveal">Professional makeup services tailored to your unique style and occasion.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {serviceItems.map((service) => (
                <div key={service.id} className="service-card overflow-hidden shadow-lg bg-white dark:bg-gray-800 scroll-reveal">
                  <img src={service.image} alt={service.title} className="w-full h-60 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-gray-900 dark:text-white">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-accent dark:text-primary font-semibold">{service.price}</span>
                      <a href="#contact" className="text-sm font-medium text-accent dark:text-primary hover:underline">Book Now</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6 text-gray-900 dark:text-white scroll-reveal">About Elena</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p className="scroll-reveal">With over 8 years of experience in the beauty industry, I specialize in creating looks that enhance natural beauty while achieving the perfect style for any occasion.</p>
                  <p className="scroll-reveal">My approach combines technical expertise with artistic vision, ensuring each client receives a personalized experience that makes them look and feel their absolute best.</p>
                  <p className="scroll-reveal">I've trained with leading makeup artists in New York and Paris, and my work has been featured in several fashion magazines and runway shows.</p>
                </div>
                <div className="mt-8 scroll-reveal">
                  <h3 className="font-playfair text-xl font-semibold mb-4 text-gray-900 dark:text-white">Professional Background</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-center">
                      <Check className="text-primary mr-2 h-5 w-5" />
                      <span>Certified Professional Makeup Artist</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-primary mr-2 h-5 w-5" />
                      <span>Fashion Week Experience (NYC, London)</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-primary mr-2 h-5 w-5" />
                      <span>Celebrity Client Portfolio</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-primary mr-2 h-5 w-5" />
                      <span>Advanced Color Theory Specialist</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="lg:w-1/2 order-1 lg:order-2 scroll-reveal">
                <img 
                  src="https://images.unsplash.com/photo-1503236823255-94609f598e71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Elena Rose Makeup Artist" 
                  className="rounded-xl shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 text-gray-900 dark:text-white scroll-reveal">Client Love</h2>
              <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 scroll-reveal">What my clients have to say about their experiences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-gray-50 dark:bg-gray-700 shadow-lg scroll-reveal">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      <Quote className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{testimonial.quote}</p>
                    <div className="flex items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 text-gray-900 dark:text-white scroll-reveal">Get In Touch</h2>
                <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 scroll-reveal">Ready to book a service or have questions? Reach out today.</p>
              </div>

              <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden scroll-reveal">
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 dark:text-gray-300">Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your name" 
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your email" 
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">Service Interest</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="bridal">Bridal Makeup</SelectItem>
                                <SelectItem value="special-event">Special Event Makeup</SelectItem>
                                <SelectItem value="photo-video">Photo/Video Makeup</SelectItem>
                                <SelectItem value="lesson">Makeup Lesson</SelectItem>
                                <SelectItem value="other">Other Inquiry</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell me about your needs..." 
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                                rows={4}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full px-6 py-3 bg-accent hover:bg-opacity-90 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                        disabled={contactMutation.isPending}
                      >
                        {contactMutation.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="scroll-reveal">
                  <div className="mx-auto w-12 h-12 bg-primary dark:bg-accent rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-playfair text-lg font-semibold mb-2 text-gray-900 dark:text-white">Location</h3>
                  <p className="text-gray-600 dark:text-gray-300">Los Angeles, CA<br/>Available for travel</p>
                </div>
                
                <div className="scroll-reveal">
                  <div className="mx-auto w-12 h-12 bg-primary dark:bg-accent rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-playfair text-lg font-semibold mb-2 text-gray-900 dark:text-white">Email</h3>
                  <p className="text-gray-600 dark:text-gray-300">hello@elenarose.com</p>
                </div>
                
                <div className="scroll-reveal">
                  <div className="mx-auto w-12 h-12 bg-primary dark:bg-accent rounded-full flex items-center justify-center mb-4">
                    <Instagram className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-playfair text-lg font-semibold mb-2 text-gray-900 dark:text-white">Social</h3>
                  <div className="flex justify-center space-x-4">
                    <a href="#" className="text-gray-500 hover:text-accent dark:hover:text-primary">
                      <Instagram className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
