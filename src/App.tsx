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

// Lazy loading with error retry
const lazyWithRetry = (componentImport: () => Promise<{ default: React.ComponentType }>) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      // Force reload on module import failure
      window.location.reload();
      return await componentImport();
    }
  });

const Warehouses = lazyWithRetry(() => import("./pages/Warehouses"));
const CommercialProposal = lazyWithRetry(() => import("./pages/CommercialProposal"));
const TEC = lazyWithRetry(() => import("./pages/TEC"));
const PartnerSystem = lazyWithRetry(() => import("./pages/PartnerSystem"));
const Ecosystem = lazyWithRetry(() => import("./pages/Ecosystem"));
const EcosystemInfo = lazyWithRetry(() => import("./pages/EcosystemInfo"));
const SalesFunnel = lazyWithRetry(() => import("./pages/SalesFunnel"));
const SalesScript = lazyWithRetry(() => import("./pages/SalesScript"));
const TenderGuide = lazyWithRetry(() => import("./pages/TenderGuide"));
const ClientHunting = lazyWithRetry(() => import("./pages/ClientHunting"));
const CallScripts = lazyWithRetry(() => import("./pages/CallScripts"));
const Achievements = lazyWithRetry(() => import("./pages/Achievements"));
const Chat = lazyWithRetry(() => import("./pages/Chat"));
const Valentine = lazyWithRetry(() => import("./pages/Valentine"));
const KP1 = lazyWithRetry(() => import("./pages/KP1"));
const KPApp = lazyWithRetry(() => import("./pages/KPApp"));
const KPApp1 = lazyWithRetry(() => import("./pages/KPApp1"));
const Ref = lazyWithRetry(() => import("./pages/Ref"));
const Otchet = lazyWithRetry(() => import("./pages/Otchet"));
const KpDepo = lazyWithRetry(() => import("./pages/KpDepo"));
const DkDepo = lazyWithRetry(() => import("./pages/DkDepo"));
const PadlDk = lazyWithRetry(() => import("./pages/PadlDk"));
const Ostrov = lazyWithRetry(() => import("./pages/Ostrov"));
const DOstrov = lazyWithRetry(() => import("./pages/DOstrov"));
const Refis = lazyWithRetry(() => import("./pages/Refis"));
const KpYgol = lazyWithRetry(() => import("./pages/KpYgol"));
const DYgol = lazyWithRetry(() => import("./pages/DYgol"));
const KpKymzas = lazyWithRetry(() => import("./pages/KpKymzas"));
const DKymzas = lazyWithRetry(() => import("./pages/DKymzas"));
const KpSclad = lazyWithRetry(() => import("./pages/KpSclad"));
const DSclad = lazyWithRetry(() => import("./pages/DSclad"));
const KPsyr = lazyWithRetry(() => import("./pages/KPsyr"));

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
          <Route path="/valentine" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#050a18] text-white/40">Загрузка...</div>}>
              <Valentine />
            </Suspense>
          } />
          <Route path="/aksinia" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#050a18] text-white/40">Загрузка...</div>}>
              <Valentine />
            </Suspense>
          } />
          <Route path="/kp1" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <KP1 />
            </Suspense>
          } />
          <Route path="/kpapp" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <KPApp />
            </Suspense>
          } />
          <Route path="/1kpapp" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <KPApp1 />
            </Suspense>
          } />
          <Route path="/ref" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#060d1a] text-white/40">Загрузка...</div>}>
              <Ref />
            </Suspense>
          } />
          <Route path="/otchet" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <Otchet />
            </Suspense>
          } />
          <Route path="/kpdepo" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <KpDepo />
            </Suspense>
          } />
          <Route path="/dkdepo" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <DkDepo />
            </Suspense>
          } />
          <Route path="/padl" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <PadlDk />
            </Suspense>
          } />
          <Route path="/ostrov" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <Ostrov />
            </Suspense>
          } />
          <Route path="/dostrov" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <DOstrov />
            </Suspense>
          } />
          <Route path="/refis" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <Refis />
            </Suspense>
          } />
          <Route path="/dsclad" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <DSclad />
            </Suspense>
          } />
          <Route path="/kpsclad" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <KpSclad />
            </Suspense>
          } />
          <Route path="/dkymzas" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <DKymzas />
            </Suspense>
          } />
          <Route path="/kpkymzas" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <KpKymzas />
            </Suspense>
          } />
          <Route path="/dygol" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <DYgol />
            </Suspense>
          } />
          <Route path="/kpygol" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <KpYgol />
            </Suspense>
          } />
          <Route path="/kpsyr" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
              <KPsyr />
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