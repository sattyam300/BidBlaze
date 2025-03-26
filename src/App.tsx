
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auctions from "./pages/Auctions";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import UserSignIn from "./pages/UserSignIn";
import UserSignUp from "./pages/UserSignUp";
import SellerSignIn from "./pages/SellerSignIn";
import SellerSignUp from "./pages/SellerSignUp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Main Pages */}
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/about" element={<About />} />
          
          {/* Authentication Routes */}
          <Route path="/user-signin" element={<UserSignIn />} />
          <Route path="/user-signup" element={<UserSignUp />} />
          <Route path="/seller-signin" element={<SellerSignIn />} />
          <Route path="/seller-signup" element={<SellerSignUp />} />
          
          {/* Placeholder Routes */}
          <Route path="/notifications" element={<Index />} /> {/* Placeholder for future pages */}
          <Route path="/contact" element={<Index />} /> {/* Placeholder for future pages */}
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
