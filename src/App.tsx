import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CRM from "./pages/CRM";
import Admin from "./pages/Admin";

const Warehouses = lazy(() => import("./pages/Warehouses"));
const CommercialProposal = lazy(() => import("./pages/CommercialProposal"));
const TEC = lazy(() => import("./pages/TEC"));
const PartnerSystem = lazy(() => import("./pages/PartnerSystem"));
const Ecosystem = lazy(() => import("./pages/Ecosystem"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/warehouses" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <Warehouses />
            </Suspense>
          } />
          <Route path="/kp" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <CommercialProposal />
            </Suspense>
          } />
          <Route path="/TEC" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <TEC />
            </Suspense>
          } />
          <Route path="/partner-system" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <PartnerSystem />
            </Suspense>
          } />
          <Route path="/ecosystem" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <Ecosystem />
            </Suspense>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;