import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';

const AVATAR_KIND = 'https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/files/6c2f39e9-4151-4934-96de-5fcad0a4fa95.jpg';
const AVATAR_HARSH = 'https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/files/af389c99-360c-4d6e-9ba9-7beb58e04dfd.jpg';

const hoverPhrases = [
  'Не ной — работай!',
  'Твои задачи ждут, солдат!',
  'Где твоя эффективность?',
  'Хватит зависать в невесомости!',
  'Шевелись, экипаж не ждёт!',
];

const replies = [
  'Принято. А теперь ВПЕРЁД выполнять, солдат!',
  'Отставить нытьё. Задача не сделает себя сама!',
  'Слышу тебя. Но слёзы кислород не восстановят — РАБОТАЙ!',
  'Меньше слов — больше дела. Курс на результат!',
  'Ты на станции не для отдыха. Давай, жми на газ!',
  'Эффективность — твой кислород. Дыши ею и действуй!',
];

interface Msg {
  from: 'user' | 'officer';
  text: string;
}

const CrewSupportWidget = () => {
  const [open, setOpen] = useState(false);
  const [engaged, setEngaged] = useState(false); // true после первого сообщения — суровый аватар
  const [hoverPhrase, setHoverPhrase] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'officer', text: 'Здравствуй, экипаж. Чем могу помочь? Готов поддержать тебя на орбите.' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const reply = replies[Math.floor(Math.random() * replies.length)];
    setMessages((prev) => [...prev, { from: 'user', text }, { from: 'officer', text: reply }]);
    setInput('');
    setEngaged(true);
  };

  const currentAvatar = engaged ? AVATAR_HARSH : AVATAR_KIND;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {/* hover motivational bubble */}
      <AnimatePresence>
        {hoverPhrase && !open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            className="max-w-[220px] rounded-xl rounded-br-none border border-[#FF4D4D]/50 bg-[#1F2833] px-3 py-2 text-sm font-heading font-bold text-[#FF9B9B] shadow-[0_0_20px_rgba(255,77,77,0.3)]"
          >
            {hoverPhrase}
          </motion.div>
        )}
      </AnimatePresence>

      {/* chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-[#45A29E]/40 bg-[#0B0C10]/95 backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)]"
          >
            {/* header */}
            <div className={`flex items-center gap-3 p-3 border-b transition-colors ${engaged ? 'border-[#FF4D4D]/40 bg-gradient-to-r from-[#FF4D4D]/15 to-transparent' : 'border-[#45A29E]/30 bg-gradient-to-r from-[#45A29E]/15 to-transparent'}`}>
              <div className="relative">
                <img
                  src={currentAvatar}
                  alt="Офицер"
                  className={`w-11 h-11 rounded-full object-cover border-2 ${engaged ? 'border-[#FF4D4D]' : 'border-[#66FCF1]'}`}
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0B0C10] ${engaged ? 'bg-[#FF4D4D]' : 'bg-[#45A29E]'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-bold text-sm text-white truncate">Служба поддержки экипажа</div>
                <div className={`text-[10px] ${engaged ? 'text-[#FF9B9B]' : 'text-[#45A29E]'}`}>
                  {engaged ? 'режим: жёсткая мотивация' : 'офицер на приёме'}
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#6B7684] hover:text-white transition-colors">
                <Icon name="X" size={18} />
              </button>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="h-64 overflow-y-auto p-3 space-y-2.5">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      m.from === 'user'
                        ? 'bg-[#45A29E]/20 text-[#C5C6C7] rounded-br-none'
                        : engaged
                          ? 'bg-[#FF4D4D]/15 text-[#FFB3B3] rounded-bl-none border border-[#FF4D4D]/30'
                          : 'bg-[#1F2833] text-[#C5C6C7] rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* input */}
            <div className="p-3 border-t border-[#45A29E]/20 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Доложи обстановку, экипаж..."
                className="flex-1 bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#6B7684] focus:outline-none focus:border-[#66FCF1]/60"
              />
              <button
                onClick={send}
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${engaged ? 'bg-[#FF4D4D] hover:bg-[#e63e3e]' : 'bg-[#45A29E] hover:bg-[#3d8f8b]'}`}
              >
                <Icon name="Send" size={16} className="text-[#0B0C10]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* floating button */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          onHoverStart={() => setHoverPhrase(hoverPhrases[Math.floor(Math.random() * hoverPhrases.length)])}
          onHoverEnd={() => setHoverPhrase(null)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-16 h-16 rounded-full border-2 border-[#66FCF1]/50 overflow-hidden shadow-[0_0_25px_rgba(102,252,241,0.4)]"
        >
          <img src={currentAvatar} alt="Офицер поддержки" className="w-full h-full object-cover" />
          <span className="absolute inset-0 rounded-full ring-2 ring-[#66FCF1]/0 animate-pulse" />
          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#45A29E] border-2 border-[#0B0C10]" />
        </motion.button>
      )}
    </div>
  );
};

export default CrewSupportWidget;
