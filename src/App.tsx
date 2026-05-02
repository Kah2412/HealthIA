import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { I18nProvider } from "@/i18n";
import Index from "./pages/Index";
import Remedios from "./pages/Remedios";
import Agua from "./pages/Agua";
import Avisos from "./pages/Avisos";
import Lazer from "./pages/Lazer";
import Artes from "./pages/Artes";
import Livros from "./pages/Livros";
import Alfabetizacao from "./pages/Alfabetizacao";
import Paciencia from "./pages/Paciencia";
import Truco from "./pages/Truco";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AccessibilityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/remedios" element={<Remedios />} />
              <Route path="/agua" element={<Agua />} />
              <Route path="/avisos" element={<Avisos />} />
              <Route path="/lazer" element={<Lazer />} />
              <Route path="/artes" element={<Artes />} />
              <Route path="/livros" element={<Livros />} />
              <Route path="/alfabetizacao" element={<Alfabetizacao />} />
              <Route path="/lazer/paciencia" element={<Paciencia />} />
              <Route path="/lazer/truco" element={<Truco />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AccessibilityProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
