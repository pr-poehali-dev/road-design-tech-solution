import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';

const integrations = [
  { name: 'BIDZAAR', icon: 'Gavel', desc: 'Мониторинг тендеров каждые 15 минут', color: 'text-amber-400', border: 'border-amber-500/30' },
  { name: 'Max', icon: 'MessageCircle', desc: 'Двусторонняя синхронизация чатов', color: 'text-blue-400', border: 'border-blue-500/30' },
  { name: 'Telegram', icon: 'Send', desc: 'Боты, рассылки и консультации клиентов', color: 'text-cyan-400', border: 'border-cyan-500/30' },
  { name: 'Почта', icon: 'Mail', desc: 'IMAP/SMTP — любой корпоративный ящик', color: 'text-sky-400', border: 'border-sky-500/30' },
];

export const IntegrationsRow = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {integrations.map((it, i) => (
        <motion.div
          key={it.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
          className={`rounded-2xl border ${it.border} bg-slate-900/50 p-4 flex items-center gap-3`}
        >
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center shrink-0">
            <Icon name={it.icon as any} size={19} className={it.color} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{it.name}</div>
            <div className="text-[11px] text-slate-400 leading-snug">{it.desc}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default IntegrationsRow;
