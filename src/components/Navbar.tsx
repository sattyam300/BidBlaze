
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center animate-pulse-light">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">
              <span className="text-gradient">Auction</span>
              <span className="text-gray-800 dark:text-gray-200">Monitor</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors link-underline"
            >
              Home
            </Link>
            <Link 
              to="/auctions" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors link-underline"
            >
              Auctions
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors link-underline"
            >
              How It Works
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors link-underline"
            >
              About
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  Sign In
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex-grow flex flex-col items-center justify-center space-y-6 py-8">
                    <h3 className="text-2xl font-bold">Choose Account Type</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center px-4">
                      Select the account type you want to sign in with
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4 w-full px-4">
                      <SheetClose asChild>
                        <Button asChild size="lg" className="w-full">
                          <Link to="/user-signin">Sign In as User</Link>
                        </Button>
                      </SheetClose>
                      
                      <SheetClose asChild>
                        <Button asChild variant="outline" size="lg" className="w-full">
                          <Link to="/seller-signin">Sign In as Seller</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button className="rounded-full">
                  Sign Up
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex-grow flex flex-col items-center justify-center space-y-6 py-8">
                    <h3 className="text-2xl font-bold">Create Account</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center px-4">
                      Choose the type of account you want to create
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4 w-full px-4">
                      <SheetClose asChild>
                        <Button asChild size="lg" className="w-full">
                          <Link to="/user-signup">Register as User</Link>
                        </Button>
                      </SheetClose>
                      
                      <SheetClose asChild>
                        <Button asChild variant="outline" size="lg" className="w-full">
                          <Link to="/seller-signup">Register as Seller</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? 
                <X className="h-6 w-6 text-gray-700 dark:text-gray-200" /> : 
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              }
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 absolute left-0 right-0 top-full shadow-md animate-fade-in">
            <div className="py-4 px-4 space-y-3">
              <Link 
                to="/" 
                className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/auctions" 
                className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Auctions
              </Link>
              <Link 
                to="/how-it-works" 
                className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                to="/about" 
                className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/user-signin" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full" variant="outline">
                    Sign In
                  </Button>
                </Link>
                <Link to="/user-signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
