import { FaInstagram, FaFacebookF, FaPinterest, FaYoutube } from "react-icons/fa";
import { Map } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SiteContent } from "@shared/schema";

export default function Footer() {
  // Fetch footer content
  const { data: footerContent = [] } = useQuery<SiteContent[]>({
    queryKey: ["/api/content/footer"],
  });

  // Helper function to get content value by key
  const getContentValue = (key: string, defaultValue: string) => {
    const content = footerContent.find((item: SiteContent) => item.key === key);
    return content ? content.value : defaultValue;
  };

  return (
    <footer className="py-10 bg-gray-900 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a href="#" className="text-2xl font-bold text-primary">
              {getContentValue('brand_name', 'Sarah Condrea')}
            </a>
            <p className="mt-2 text-gray-400">{getContentValue('tagline', 'Makeup Artist & Beauty Specialist')}</p>
            <p className="mt-1 text-gray-400 flex items-center">
              <Map className="h-4 w-4 mr-1" /> {getContentValue('location', 'Barlad, Romania')}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 text-center md:text-left">
            <a href="#portfolio" className="text-gray-300 hover:text-primary transition-colors">
              {getContentValue('menu_portfolio', 'Portfolio')}
            </a>
            <a href="#services" className="text-gray-300 hover:text-primary transition-colors">
              {getContentValue('menu_services', 'Services')}
            </a>
            <a href="#about" className="text-gray-300 hover:text-primary transition-colors">
              {getContentValue('menu_about', 'About')}
            </a>
            <a href="#contact" className="text-gray-300 hover:text-primary transition-colors">
              {getContentValue('menu_contact', 'Contact')}
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">{getContentValue('copyright', `© ${new Date().getFullYear()} Sarah Condrea. All rights reserved.`)}</p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href={getContentValue('instagram_url', '#')} className="text-gray-400 hover:text-primary transition-colors">
              <FaInstagram className="text-xl" />
            </a>
            <a href={getContentValue('facebook_url', '#')} className="text-gray-400 hover:text-primary transition-colors">
              <FaFacebookF className="text-xl" />
            </a>
            <a href={getContentValue('pinterest_url', '#')} className="text-gray-400 hover:text-primary transition-colors">
              <FaPinterest className="text-xl" />
            </a>
            <a href={getContentValue('youtube_url', '#')} className="text-gray-400 hover:text-primary transition-colors">
              <FaYoutube className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
