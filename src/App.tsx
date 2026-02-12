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
const EcosystemInfo = lazy(() => import("./pages/EcosystemInfo"));
const SalesFunnel = lazy(() => import("./pages/SalesFunnel"));
const SalesScript = lazy(() => import("./pages/SalesScript"));
const TenderGuide = lazy(() => import("./pages/TenderGuide"));
const ClientHunting = lazy(() => import("./pages/ClientHunting"));
const CallScripts = lazy(() => import("./pages/CallScripts"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Chat = lazy(() => import("./pages/Chat"));

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
          <Route path="/ecosystem/gl" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <EcosystemInfo />
            </Suspense>
          } />
          <Route path="/sales-funnel" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <SalesFunnel />
            </Suspense>
          } />
          <Route path="/ecosystem/sales-script" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <SalesScript />
            </Suspense>
          } />
          <Route path="/ecosystem/tender-guide" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <TenderGuide />
            </Suspense>
          } />
          <Route path="/ecosystem/client-hunting" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <ClientHunting />
            </Suspense>
          } />
          <Route path="/ecosystem/call-scripts" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <CallScripts />
            </Suspense>
          } />
          <Route path="/achievements" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <Achievements />
            </Suspense>
          } />
          <Route path="/chat" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <Chat />
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