import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

export default function ClientHuntingHeader() {
  return (
    <section className="py-12 bg-slate-900/50 border-b border-cyan-500/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Link to="/ecosystem">
            <Button variant="ghost" className="mb-6 text-cyan-400 hover:text-cyan-300">
              <Icon name="ArrowLeft" className="mr-2" size={18} />
              Назад в экосистему
            </Button>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Охота за клиентами
          </h1>
          <p className="text-lg text-slate-300 mb-6">
            Полное руководство: где искать, как квалифицировать и закрывать крупные B2B-сделки
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Icon name="Target" size={16} className="text-cyan-400" />
              <span>Целевые аудитории</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Search" size={16} className="text-purple-400" />
              <span>5 источников лидов</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle" size={16} className="text-blue-400" />
              <span>Система BANT</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
