import { FaInstagram, FaFacebookF, FaPinterest, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="py-10 bg-gray-900 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a href="#" className="text-2xl font-playfair font-bold text-primary">
              Elena Rose
            </a>
            <p className="mt-2 text-gray-400">Makeup Artist & Beauty Specialist</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 text-center md:text-left">
            <a href="#portfolio" className="text-gray-300 hover:text-primary transition-colors">
              Portfolio
            </a>
            <a href="#services" className="text-gray-300 hover:text-primary transition-colors">
              Services
            </a>
            <a href="#about" className="text-gray-300 hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-300 hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Elena Rose. All rights reserved.</p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <FaInstagram className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <FaFacebookF className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <FaPinterest className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <FaYoutube className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
