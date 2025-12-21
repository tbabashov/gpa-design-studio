import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import CalculatorPage from "./pages/CalculatorPage";
import FeaturesPage from "./pages/FeaturesPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const handleNavigateHome = () => {
    window.location.href = '/';
  };

  const handleNavigate = (section: string) => {
    if (section === 'home') window.location.href = '/';
    else if (section === 'calculator') window.location.href = '/calculator';
    else if (section === 'features') window.location.href = '/features';
    else if (section === 'contact') window.location.href = '/contact';
  };

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/calculator" element={<CalculatorPage onNavigateHome={handleNavigateHome} />} />
                <Route path="/features" element={<FeaturesPage onNavigate={handleNavigate} />} />
                <Route path="/contact" element={<ContactPage onNavigate={handleNavigate} />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
