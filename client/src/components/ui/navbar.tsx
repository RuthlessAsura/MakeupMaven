import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileMenu } from "@/components/ui/mobile-menu";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "#home", label: "Home" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full py-4 bg-white dark:bg-gray-900 z-50 transition-all duration-300 ${
        scrolled ? "shadow-md dark:shadow-gray-800/20" : ""
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="text-2xl font-normal text-gray-900 dark:text-white">
          Makeup Artist
        </a>
        
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-8 text-sm font-medium uppercase tracking-wider">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link hover:text-accent dark:hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center ml-4">
            <ThemeToggle />
            <Button 
              asChild 
              className="ml-4 bg-accent text-white rounded-none font-normal text-sm uppercase tracking-wider px-4 py-2"
            >
              <a href="#contact">Book Now</a>
            </Button>
          </div>
        </div>
        
        <MobileMenu links={links} />
      </div>
    </motion.header>
  );
}
