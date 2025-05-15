import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type MobileMenuProps = {
  links: Array<{ href: string; label: string }>;
};

export function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-primary"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg absolute w-full left-0 top-full py-4 px-6 z-50"
          >
            <nav className="flex flex-col space-y-4 text-gray-600 dark:text-gray-300">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="py-2 hover:text-accent dark:hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              
              <div className="pt-2 flex items-center">
                <span className="text-sm mr-3">Theme:</span>
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
