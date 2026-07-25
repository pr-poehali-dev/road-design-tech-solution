import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import StarfieldBackground from '@/components/deod/StarfieldBackground';
import OrbitTicker from '@/components/deod/OrbitTicker';
import MissionHeader from '@/components/deod/MissionHeader';
import CosmicAnalytics from '@/components/deod/CosmicAnalytics';
import SectionCard from '@/components/deod/SectionCard';
import CrewSupportWidget from '@/components/deod/CrewSupportWidget';
import { sections } from '@/components/deod/sectionsData';

const DeodSpace = () => {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-white relative overflow-hidden font-sans">
      {/* deep space gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0C10] via-[#12132a] to-[#0B0C10]" />
        <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#45A29E]/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#663399]/12 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[30vw] h-[30vw] rounded-full bg-[#FF6600]/5 blur-[100px]" />
      </div>
      <StarfieldBackground />

      {/* neon grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(#66FCF1 1px, transparent 1px), linear-gradient(90deg, #66FCF1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* big flying rocket in background */}
      <div className="fixed top-24 right-8 pointer-events-none hidden lg:block opacity-40">
        <div className="animate-rocket-fly">
          <div className="relative">
            <Icon name="Rocket" size={90} className="text-[#66FCF1]/40" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-16 bg-gradient-to-t from-transparent via-[#FF6600]/50 to-[#FF6600]/80 blur-md rotate-[225deg] origin-top" />
          </div>
        </div>
      </div>

      {/* content */}
      <div className="relative z-10">
        <MissionHeader />
        <OrbitTicker />

        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* intro line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#45A29E]/40" />
            <span className="font-mono text-[11px] text-[#45A29E] uppercase tracking-[0.3em]">
              Все системы онлайн · выберите модуль станции
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#45A29E]/40" />
          </motion.div>

          {/* cosmic analytics */}
          <div className="mb-8">
            <CosmicAnalytics />
          </div>

          {/* section grid */}
          <div className="flex items-center gap-2 mb-4">
            <Icon name="LayoutGrid" size={18} className="text-[#66FCF1]" />
            <h2 className="font-heading font-bold text-lg text-white tracking-wide">Модули станции</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, i) => (
              <SectionCard key={section.id} section={section} index={i} />
            ))}
          </div>

          {/* footer status */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-mono text-[#45A29E]/70 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#45A29E] animate-pulse" /> Реактор: стабилен</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] animate-pulse" /> Связь: 100%</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF6600] animate-pulse" /> DEAD SPACE: активен</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D] animate-pulse" /> Аномалий: 14</span>
          </div>
        </main>
      </div>

      <CrewSupportWidget />
    </div>
  );
};

export default DeodSpace;
